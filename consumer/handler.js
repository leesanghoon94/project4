const AWS = require('aws-sdk');

exports.handler = async (event, context) => {
  try {
    let messages = event.Records;
    console.log(`Received ${messages.length} messages from SQS`);

    // Log each message
    messages.forEach((record) => {
      let message = record.body;
      console.log('Message:', message);
      // If you want to see the content of the message
      let dbData = JSON.parse(message);
      console.log('Message Body:', dbData);
    });
  } catch (error) {
    console.error('Error occurred:', error);
  }
};
