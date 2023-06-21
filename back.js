const AWS = require('aws-sdk');
const fs = require('fs');


AWS.config.update({ region: 'ap-northeast-2' }); 


const ecr = new AWS.ECR();
const ecs = new AWS.ECS();

// ECR 리포지토리 생성
async function createECRRepository(repositoryName) {
  const params = {
    repositoryName: repositoryName
  };

  try {
    const response = await ecr.createRepository(params).promise();
    console.log('ECR 리포지토리가 성공적으로 생성되었습니다.');
    return response.repository.repositoryUri;
  } catch (err) {
    console.error('ECR 리포지토리 생성에 실패했습니다.', err);
    throw err;
  }
}

// Docker 이미지 빌드 및 ECR에 푸시
async function buildAndPushDockerImage(repositoryUri, dockerfilePath) {
  const imageName = `${repositoryUri}:latest`;

  const params = {
    repositoryName: repositoryUri,
    buildArgs: {},
    dockerfile: dockerfilePath,
    tags: [imageName]
  };

  try {
    const response = await ecr.startImageScan(params).promise();
    console.log('Docker 이미지 빌드 및 ECR에 푸시되었습니다.');
    return imageName;
  } catch (err) {
    console.error('Docker 이미지 빌드 및 ECR 푸시에 실패했습니다.', err);
    throw err;
  }
}

// ECS 작업(Task) 생성
async function createECSTask(taskDefinition, clusterName) {
  const params = {
    taskDefinition: taskDefinition,
    cluster: clusterName,
    count: 1,
    launchType: 'FARGATE',
    networkConfiguration: {
      awsvpcConfiguration: {
        subnets: ['Ssubnet-072a004b0a546e6f0'],
        assignPublicIp: 'ENABLED'
      }
    }
  };

  try {
    const response = await ecs.runTask(params).promise();
    console.log('ECS 작업이 성공적으로 생성되었습니다.');
    return response.tasks[0].taskArn;
  } catch (err) {
    console.error('ECS 작업 생성에 실패했습니다.', err);
    throw err;
  }
}


async function main() {
  try {
    const repositoryName = 'team1-ecr'; 
    const dockerfilePath = './dockerfile';
    const clusterName = 'team1-ecs'; 
    const taskDefinition = 'team1-ecs-task-definition';

   
const repositoryUri = await createECRRepository(repositoryName);

const imageName = await buildAndPushDockerImage(repositoryUri, dockerfilePath);

const taskArn = await createECSTask(taskDefinition, clusterName);

console.log('작업(Task)이 생성되었습니다.');
console.log('ECR 리포지토리 URI:', repositoryUri);
console.log('Docker 이미지 이름:', imageName);
console.log('작업(Task) ARN:', taskArn);
} catch (err) {
console.error('오류가 발생했습니다.', err);
}
}

// main 함수 실행
main();