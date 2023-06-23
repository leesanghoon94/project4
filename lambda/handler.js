const mysql = require('mysql');
const AWS = require('aws-sdk');

// Create SQS service object
let sqs = new AWS.SQS({apiVersion: '2012-11-05', region: 'ap-northeast-2'});

const dbConnection = mysql.createConnection({
  host     : 'terraform-20230622052736232100000001.cxamxtdxagfz.ap-northeast-2.rds.amazonaws.com',
  user     : 'root',
  password : '12345678',
  database : 'RECORD'
});

exports.handler = async (event, context) => {
  let dbData = await getDataFromDB();
  let message = {
    QueueUrl: 'arn:aws:sqs:ap-northeast-2:124121153800:SQS-hwani',
    MessageBody: JSON.stringify(dbData),
  };
  
  sqs.sendMessage(message, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data.MessageId);
    }
  });
}

function getDataFromDB() {
  return new Promise((resolve, reject) => {
    dbConnection.query('SELECT * FROM record', function (error, results, fields) {
      if (error) reject(error);

      console.log('Record Data:', results);

      resolve(results);
    });
  });
}
