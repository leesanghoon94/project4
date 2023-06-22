provider "aws" {
    region = "ap-northeast-2"
}

resource "aws_db_subnet_group" "default" {
    name       = "team1_database_subnet_group"
    subnet_ids = [
        "subnet-093bc1cebb91c00f9",
        "subnet-001d2da3df3529a3f"
    ]

    tags = {
        Name = "team1 database subnet group"
    }
}

resource "aws_db_instance" "default" {
    allocated_storage    = 20
    storage_type         = "gp2"
    engine               = "mysql"
    engine_version       = "8.0"
    instance_class       = "db.t2.micro"
    username             = "root"
    password             = "12345678"
    parameter_group_name = "default.mysql8.0"
    db_subnet_group_name = aws_db_subnet_group.default.name
    skip_final_snapshot  = true
    publicly_accessible  = false  # Since it is in private subnet
    vpc_security_group_ids = ["sg-0dbdd2082538975ba"]  # Replace this with your VPC's security group ID
}
