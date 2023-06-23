const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const sqs = new SQSClient();

const mysql = require("mysql2/promise");
const connectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  prot: process.env.DB_PORT
};

const producer = async (event) => {
  let statusCode = 200;
  let message;

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No body was found",
      }),
    };
  }

  try {
    // Connect to MySQL
    const connection = await mysql.createConnection(connectionConfig);

    // Fetch records from MySQL
    const [rows] = await connection.execute(
      "SELECT * FROM record"
    );

    // Send records as SQS messages
    for (const row of rows) {
      await sqs.send(
        new SendMessageCommand({
          QueueUrl: process.env.QUEUE_URL,
          MessageBody: JSON.stringify(row),
        })
      );
    }

    // Close MySQL connection
    await connection.end();

    message = "Messages sent!";
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
      const connection = await mysql.createConnection(connectionConfig);

      // Parse message body as JSON
      const data = JSON.parse(record.body);

      // Insert data into MySQL
      await connection.execute(
        "INSERT INTO point (seq, competition_seq, participant_seq, complete_status, competition_type_seq, reg_date) VALUES (?, ?, ?, ?, ?, ?)",
        [
          data.seq,
          data.competition_seq,
          data.participant_seq,
          data.complete_status,
          data.competition_type_seq,
          data.reg_date,
        ]
      );

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
