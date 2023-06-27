# AWS provider 설정
provider "aws" {
  region  = "ap-northeast-2" 
}


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
  family                   = "record-task"
  network_mode             = "awsvpc"
  cpu                      = "256"
  memory                   = "512"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn 

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
