# 1팀 : The first

# 마라톤대회 기록 관리 시스템 🏃

![스크린샷 2023-06-16 095736](https://github.com/cs-devops-bootcamp/devops-04-Final-Team1/assets/126463087/9ac0be0e-6643-413f-988d-10596a0a9fb9)

목차

## 프로젝트 소개

<p align="justify">
프로젝트 개요/동기
</p>

<p align="center">
GIF Images
</p>

<br>

## 기술 스택

|                                                  JavaScript                                                  |                                               mysql                                                |                                                fastify                                                 |                                                  aws                                                  |                                                docker                                                |
| :----------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: |
| ![image](https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) | ![image](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) | ![image](https://img.shields.io/badge/Fastify-202020?style=for-the-badge&logo=fastify&logoColor=white) | ![image](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white) | ![image](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) |

|                                                 terraform                                                  |                                                     githubaction                                                     |                                                  serverless                                                  |                                               vite                                               |                                               react                                                |                                                           grafana                                                           |
| :--------------------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------: |
| ![image](https://img.shields.io/badge/Terraform-623CE4?style=for-the-badge&logo=terraform&logoColor=white) | ![image](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white) | ![image](https://img.shields.io/badge/Serverless-FD5750?style=for-the-badge&logo=serverless&logoColor=white) | ![image](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) | ![image](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) | ![image](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white) |

<br>

## 구현 기능

### AWS Cognito 기반의 JWT Token 인증 서비스

- Cognito를 사용하여 사용자 인증, 관리에 대한 처리를 위임하여 빠른 개발 가능
- 인증된 사용자에게 JWT Token를 발급하여 유효한 사용자만 요청을 처리하여 보안성을 강화

### S3, CloudFront 를 활용한 정적페이지 서비스

- S3를 사용하여 정적페이지를 효율적으로 저장하고 CloundFront를 사용하여 빠른 컨텐츠를 제공
- 자동화 된 배포파이프라인을 구축하여 빠른 컨텐츠 업데이트 가능

### Github Actions 기반의 ECR/ECS CI/CD 파이프라인

- Github Actions를 활용하여 AWS의 ECR과 ECS에 대한 CI/CD 파이프라인을 구축

### ECS를 활용한 트래픽 대응

- ECS의 오토 스케일링 기능을 활용하여 트래픽 변동에 따른 서비스 규모를 자동화

### Lambda와 SQS, EventBridge를 이용한 느슨한 결합 아키텍처

- AWS Lambda와 SQS를 이용해 각 서비스간의 의존성을 줄이고 독립적으로 사용되도록 느슨한 결합 형태의 아키텍처를 구축
- EventBridge를 사용하여 각 서비스간의 연결된 복잡한 이벤트를 효율적으로 처리

### Cloudwatch와 Grapana를 이용한 시각화 모니터링 시스템

- AWS Cloudwatch와 Grapana를 이용하여 백엔드 서버의 트래픽 모니터링 및 경고 알람 설정

<br>

## 배운 점 & 아쉬운 점

<p align="justify">

</p>

<br>

## 라이센스

MIT &copy; [NoHack](mailto:lbjp114@gmail.com)

<!-- Stack Icon Refernces -->

[js]: /images/stack/javascript.svg
[ts]: /images/stack/typescript.svg
[react]: /images/stack/react.svg
[node]: /images/stack/node.svg
