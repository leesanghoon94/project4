const { SQSClient, SendMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");
const sqs = new SQSClient();

require('dotenv').config();

const mysql = require('mysql2/promise');

const producer = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
    });

    const [rows] = await connection.execute('SELECT * FROM competition');
    console.log(rows);

    const messages = JSON.stringify(rows.map((row) => ({
      seq: row.seq,
      title: row.title,
      start_day: row.start_day,
      recruits: row.recruits,
    })));
    console.log(messages);

    await connection.end();

    try {
      await sqs.send(new SendMessageCommand({
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: messages,
        MessageAttributes: {
          AttributeName: {
            StringValue: "Attribute Value",
            DataType: "String",
          },
        },
      }));

      console.log("Message(s) accepted!");
    } catch (err) {
      console.error(err);
      throw err;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

producer().catch(console.error);


const consumer = async (event) => {
  for (const record of event.Records) {
    try {
      const competitions = JSON.parse(record.body);
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
      });

      const [result] = await connection.execute(
        "INSERT INTO competition (seq, title, start_day, recruits) VALUES (?, ?, ?, ?)",
        [competitions.seq, competitions.title, competitions.start_day, competitions.recruits]
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

      console.log("Message processed and deleted from the queue.");
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

module.exports = {
  producer,
  consumer,
};
