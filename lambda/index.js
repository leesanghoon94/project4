const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const sqs = new SQSClient();
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
dotenv.config();

const producer = async (event) => {

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
    });
  

    // Fetch records from MySQL
    const [rows] = await connection.execute("SELECT * FROM record");
    console.log(rows);
    console.log("기록 가져오기 완료");

    // Send records as SQS messages
    const messages = rows.map((row) => ({
      seq: row.seq,
      competition_seq: row.competition_seq,
      complete_status: row.complete_status,
      competition_type_seq: row.competition_type_seq,
      reg_date: row.reg_date,
    }));


    // 서버 연결 끊기
    await connection.end();
    console.log("서버 연결 끊기 완료");

    await sqs.send(
      new SendMessageCommand({
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: JSON.stringify(messages)
      })
    );
    console.log("SQS 메시지 전송 완료");

    
  } catch (error) {
    console.log(error);
    message = error;
    statusCode = 500;
  }

  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
};

const consumer = async (event) => {
  for (const record of event.Records) {
    const messageAttributes = record.messageAttributes;
    console.log("Message Attribute: ", messageAttributes.AttributeName.stringValue);
    console.log("Message Body: ", record.body);

    try {
      // Connect to MySQL
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
      });

      // Parse message body as JSON
      const messages = JSON.parse(record.body);
      console.log(messages);

      // Insert data into MySQL
      for (const message of messages) {
        const [result] = await connection.execute(
          "INSERT INTO payment_point (participant_seq, record_seq, point, reg_date) VALUES (?, ?, ?, ?)",
          [message.participant_seq, message.seq, message.complete_status, message.reg_date]
        );
        console.log(result);
      }

      // Close MySQL connection
      await connection.end();
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = {
  producer,
  consumer,
};