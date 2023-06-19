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

async function routes(fastify, options) {

  fastify.get('/', (request, reply) => {
    reply.send({message: '마라톤대회 기록관리 시스템에 오신걸 환영합니다.'});
  });

  fastify.get('/offtherecord', (request, reply) => {
    connection.query('SELECT * FROM offtherecord', (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        reply.status(500).send('Error executing query');
        return;
      }
      reply.send(results);
    });
  });

  fastify.get('/competition', (request, reply) => {
    connection.query('SELECT * FROM competition', (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        reply.status(500).send('Error executing query');
        return;
      }
      reply.send(results);
    });
  });

  fastify.get('/competition_type', (request, reply) => {
    connection.query('SELECT * FROM competition_type', (err, results) => {
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
  
    const currentDate = new Date();
    const regDate = currentDate.toISOString();
  
    const query = 'INSERT INTO offtherecord (user_id, title, complete_status, competition_type_seq, reg_date) VALUES (?, ?, ?, ?, ?)';
    const values = [data.user_id, data.title, data.complete_status, data.competition_type_seq, regDate];
  
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
  

module.exports = routes;
