<<<<<<< HEAD
"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/", async (request, reply) => {
    try {
      const connection = await fastify.mysql.getConnection();
      const result = await connection.query(
        "SELECT * FROM competition_type",
        []
      );
      reply.code(200).send(result[0]);
    } catch (error) {
      reply.code(503).send(error);
    }
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
  fastify.get('/competition_type', (request, reply) => {
    connection.query('SELECT * FROM competition_type', (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        reply.status(500).send('Error executing query');
        return;
      }
      reply.send(results);
    });
>>>>>>> eeb0d36af23f1788ec7ed1ebae670f5fec5490af
  });
};
