const mysql = require('mysql');
const AWS = require('aws-sdk');

// Create SQS service object
const sqs = new AWS.SQS({ apiVersion: '2012-11-05', region: 'ap-northeast-2' });

exports.handler = async (event, context) => {
  try {
    const dbData = await getDataFromDB();
    console.log('Retrieved data from DB:', dbData);

    const message = {
      QueueUrl: 'https://sqs.ap-northeast-2.amazonaws.com/124121153800/SQS-hwani',
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
      host: 'terraform-20230622052736232100000001.cxamxtdxagfz.ap-northeast-2.rds.amazonaws.com',
      user: 'root',
      password: '12345678',
      database: 'RECORD',
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
