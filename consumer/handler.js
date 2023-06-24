const mysql = require('mysql');
const AWS = require('aws-sdk');

const dbConnection = mysql.createConnection({
  host: 'terraform-20230622052736232100000001.cxamxtdxagfz.ap-northeast-2.rds.amazonaws.com',
  user: 'root',
  password: '12345678',
  database: 'RECORD'
});

exports.handler = async (event, context) => {
  try {
    let messages = event.Records;
    console.log(`Received ${messages.length} messages from SQS`);

    for (let message of messages) {
      let dbData = JSON.parse(message.body);
      if (!Array.isArray(dbData)) {
        dbData = [];
      }

      let updatedDbData = addPointsToData(dbData);
      updatedDbData = await filterDuplicates(updatedDbData);
      await insertDataToDB(updatedDbData);
    }

    console.log('All records processed successfully');
    return {
      statusCode: 200,
      body: 'All records processed successfully'
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: 'Error occurred while processing records'
    };
  }
}

function addPointsToData(dbData) {
  return dbData.map(record => {
    const competitionTypeSeq = record.competition_type_seq;
    let point = 0;

    // Parse Buffer data in complete_status
    const completeStatusBuffer = Buffer.from(record.complete_status.data);
    const completeStatus = completeStatusBuffer.readUInt8(0);

    if (completeStatus === 1) {
      if (competitionTypeSeq === 1) {
        point = 10;
      } else if (competitionTypeSeq === 2) {
        point = 20;
      } else if (competitionTypeSeq === 3) {
        point = 42;
      }
    }

    return {
      ...record,
      point: point
    };
  });
}

async function filterDuplicates(dbData) {
  let uniqueData = [];

  for (let record of dbData) {
    let query = "SELECT COUNT(*) AS count FROM payment_point WHERE record_seq = ?";
    let params = [record.seq];

    let result = await new Promise((resolve, reject) => {
      dbConnection.query(query, params, function (error, results, fields) {
        if (error) reject(error);
        resolve(results[0].count);
      });
    });

    if (result === 0) {
      uniqueData.push(record);
    }
  }

  return uniqueData;
}

function insertDataToDB(dbData) {
  return new Promise((resolve, reject) => {
    if (dbData.length === 0) {
      console.log('No data to insert');
      resolve([]);
      return;
    }

    let query = "INSERT INTO payment_point (participant_seq, record_seq, point, reg_date) VALUES ?";
    let values = dbData.map(record => [
      record.participant_seq,
      record.seq,
      record.point,
      new Date(record.reg_date)
    ]);

    dbConnection.query(query, [values], function (error, results, fields) {
      if (error) {
        console.error('Error in insertDataToDB:', error);
        reject(error);
      } else {
        console.log(`Inserted ${results.affectedRows} rows into the database`);
        resolve(results);
      }
    });
  });
}
