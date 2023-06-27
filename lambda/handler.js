require('dotenv').config();
const mysql = require('mysql');
const AWS = require('aws-sdk');

// Create SQS service object
const sqs = new AWS.SQS({ apiVersion: '2012-11-05', region: 'ap-northeast-2' });

exports.handler = async (event, context) => {
  try {
    const dbData = await getDataFromDB();
    console.log('Retrieved data from DB:', dbData);

    const message = {
      QueueUrl: process.env.SQS_QUEUE_URL,
      MessageBody: JSON.stringify(dbData),
    };
    console.log(message)

    await sendMessageToSQS(message);
    console.log("Successfully sent message to SQS.");
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

function getDataFromDB() {
  return new Promise((resolve, reject) => {
    const dbConnection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    dbConnection.query('SELECT * FROM record', function (error, results, fields) {
      dbConnection.end(); // Move this line up

      if (error) {
        console.error('DB Error:', error); // Add error logging
        reject(error);
      }

      console.log('Record Data:', results);

      resolve(results);
    });
  });
}

async function sendMessageToSQS(message) {
  console.log('Sending message:', message);

  try {
    const data = await sqs.sendMessage(message).promise();
    console.log('SQS Success:', data); // Add success logging
  } catch (err) {
    console.error('SQS Error:', err); // Add error logging
    throw err;
  }
}
