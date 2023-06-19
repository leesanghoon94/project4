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

module.exports = async function (fastify, opts) {
  fastify.get('/offtherecord', (request, reply) => {
    connection.query('SELECT user_id, title, IF(complete_status, \'true\', \'false\') as complete_status, competition_type_seq, reg_date FROM offtherecord', (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        reply.status(500).send('Error executing query');
        return;
      }
      reply.send(results);
    });
  });

  fastify.post('/offtherecord', (request, reply) => {
    const data = request.body;
  
    const query = 'INSERT INTO offtherecord (user_id, title, complete_status, competition_type_seq, reg_date) VALUES (?, ?, ?, ?, NOW())';
    const values = [data.user_id, data.title, data.complete_status, data.competition_type_seq];
    
  
    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        reply.status(500).send('Error executing query');
        return;
      }
  
      reply.status(201).send({ message: 'Data successfully added to database' });
    });
  });
}
