<<<<<<< HEAD
"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/", async (request, reply) => {
    try {
      if (request.userData.group !== "anonymous") {
        reply.code(401).send({ message: "Unauthorized Menu" });
        return;
      }

      const connection = await fastify.mysql.getConnection();
      const result = await connection.query(
        `SELECT
        c.title,
        b.user_id,
        b.user_name,
        a.point,
        a.reg_date
        FROM payment_point as a 
        INNER JOIN participant as b 
          ON a.participant_seq = b.seq
        INNER JOIN competition as c
          ON b.competition_seq = c.seq
        WHERE b.user_id = ?`,
        [request.userData.email]
      );

      reply.code(200).send(result[0]);
    } catch (error) {
      reply.code(500).send(error);
    }
  });
};
=======
'use strict';
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'terraform-20230619024655981100000001.cxamxtdxagfz.ap-northeast-2.rds.amazonaws.com',
  user: 'root',
  password: '12345678',
  database: 'RECORD'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

module.exports = async function(fastify, opts) {
  fastify.get('/payment_point', (request, reply) => {
    connection.query('SELECT * FROM payment_point', (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        reply.status(500).send('Error executing query');
        return;
      }
      reply.send(results);
    });
  });
};
>>>>>>> eeb0d36af23f1788ec7ed1ebae670f5fec5490af
