const mysql = require('mysql');
const AWS = require('aws-sdk');

// Create SQS service object
let sqs = new AWS.SQS({apiVersion: '2012-11-05', region: 'ap-northeast-2'});

const dbConnection = mysql.createPool({
  connectionLimit: 10,
  host: 'terraform-20230622052736232100000001.cxamxtdxagfz.ap-northeast-2.rds.amazonaws.com',
  user: 'root',
  password: '12345678',
  database: 'RECORD'
});

exports.handler = async (event, context) => {
  console.log('Event:', event);
  try {
    // Read the message from the SQS event
    let message = event.Records[0].body;
    let dbData = JSON.parse(message);

    // Check if dbData is an array
    if (!Array.isArray(dbData)) {
      console.log('Invalid data format. Expected an array.');
      return {
        statusCode: 400,
        body: 'Invalid data format. Expected an array.'
      };
    }

    // Loop through each record and insert it into the database
    for (let record of dbData) {
      // Insert the data into the database
      await insertDataToDB(record);
    }

    console.log('All records inserted successfully');
    return {
      statusCode: 200,
      body: 'All records inserted successfully'
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'Error occurred while inserting records'
    };
  } finally {
    // Close the database connection
    dbConnection.end();
  }
};

function insertDataToDB(record) {
  return new Promise((resolve, reject) => {
    let query = "INSERT IGNORE INTO payment_point (participant_seq, record_seq, point, reg_date) VALUES (?, ?, ?, NOW())";
    let values = [record.participant_seq, record.seq, record.complete_status];

    dbConnection.getConnection((error, connection) => {
      if (error) {
        reject(error);
        return;
      }

      connection.query(query, values, function (error, results, fields) {
        connection.release();

        if (error) reject(error);

        if (results.affectedRows === 0) {
          console.log('Duplicate data found. Ignored.');
        } else {
          console.log('Data inserted successfully');
        }

        resolve(results);
      });
    });
  });
}
