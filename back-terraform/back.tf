# AWS provider 설정
provider "aws" {
  region  = "ap-northeast-2" # 여기에 원하는 AWS region을 입력
}

# AWS ECR (Elastic Container Registry) 리포지토리 생성
resource "aws_ecr_repository" "repository" {
  name = "back-ecr"
}

resource "aws_ecr_lifecycle_policy" "lifecycle_policy" {
  repository = aws_ecr_repository.repository.name

  policy = <<-EOF
  {
    "rules": [
      {
        "rulePriority": 1,
        "description": "Expire images older than 14 days",
        "selection": {
          "tagStatus": "untagged",
          "countType": "sinceImagePushed",
          "countUnit": "days",
          "countNumber": 14
        },
        "action": {
          "type": "expire"
        }
      }
    ]
  }
  EOF
}

# ECS 클러스터 생성
resource "aws_ecs_cluster" "cluster" {
  name = "back-ecs" 
}

# ECS task definition 생성
resource "aws_ecs_task_definition" "task" {
  family                   = "record-task" # Task definition 이름
  network_mode             = "awsvpc" # 네트워크 모드 설정
  cpu                      = "256" # 할당될 CPU 양
  memory                   = "512" # 할당될 메모리 양
  requires_compatibilities = ["FARGATE"] # ECS 운영 형태 설정
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn # ECS 실행 역할 설정

  container_definitions = <<-DEFINITIONS
  [
    {
      "name": "record-container",
      "image": "${aws_ecr_repository.repository.repository_url}:latest",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 80,
          "hostPort": 80
        }
      ]
    }
  ]
  DEFINITIONS
}

resource "aws_iam_role" "ecs_execution_role" {
  name = "ecs_execution_role"

  assume_role_policy = <<-EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "",
        "Effect": "Allow",
        "Principal": {
          "Service": "ecs-tasks.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }
  EOF
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}
