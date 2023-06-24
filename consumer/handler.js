const AWS = require('aws-sdk');
const sqs = new AWS.SQS({ apiVersion: '2012-11-05', region: 'ap-northeast-2' });

exports.handler = async (event, context) => {
  try {
    let messages = await receiveMessagesFromSQS();
    console.log('Received messages from SQS:', messages);
  } catch (error) {
    console.error('Error occurred:', error);
  }
};

function receiveMessagesFromSQS() {
  return new Promise((resolve, reject) => {
    let params = {
      QueueUrl: 'https://sqs.ap-northeast-2.amazonaws.com/124121153800/SQS-hwani',
      MaxNumberOfMessages: 10
    };

    sqs.receiveMessage(params, function (err, data) {
      if (err) {
        console.error('Error in receiveMessagesFromSQS:', err);
        reject(err);
      } else {
        let messages = data.Messages || [];
        console.log(`Received ${messages.length} messages from SQS`);

        // Log each message
        messages.forEach(message => {
          console.log('Message:', message);
          // If you want to see the content of the message
          let dbData = JSON.parse(message.Body);
          console.log('Message Body:', dbData);
        });

        resolve(messages);
      }
    });
  });
}
