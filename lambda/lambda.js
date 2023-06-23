const { SQSClient, SendMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
const sqs = new SQSClient();
require('dotenv').config();
const mysql = require('mysql2/promise');

const producer = async (event) => {
  let message;
  let statusCode;

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
    });

    const [rows] = await connection.execute('SELECT * FROM competitions');
    console.log(rows);

    const messages = JSON.stringify(rows.map((row) => ({
      seq: row.seq,
      title: row.title,
      start_day: row.start_day,
      recruits: row.recruits,
    })));

    await connection.end();

    try {
      await sqs.send(new SendMessageCommand({
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: messages, // messages 변수에 저장된 JSON 문자열을 전송합니다.
      }));


    } catch (err) {
      console.error(err);
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Message(s) accepted!",
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to send message to SQS",
        error: error.message,
      }),
    };
  }};

const consumer = async (event) => {
  for (const record of event.Records) {
    try {
      const score = JSON.parse(record.body);
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
      });

      const [result] = await connection.execute(
        "INSERT INTO scores (seq, title, start_day, recruits) VALUES (?, ?, ?, ?)",
        [score.seq, score.title, score.start_day, score.recruits]
      );
      console.log(result);
      await connection.end();

      // Delete the message from the queue
      await sqs.send(
        new DeleteMessageCommand({
          QueueUrl: process.env.QUEUE_URL,
          ReceiptHandle: record.receiptHandle,
        })
      );
    } catch (error) {
      console.error(error);
    }
  }
};

module.exports = {
  producer,
  consumer,
};
