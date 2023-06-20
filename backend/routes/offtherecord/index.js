"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/", async (request, reply) => {
    try {
      const connection = await fastify.mysql.getConnection();
      const result = await connection.query(
        "SELECT o.user_id, o.title, IF(o.complete_status, 'true', 'false') as complete_status, c.type_name as competition_type, o.reg_date FROM offtherecord o JOIN competition_type c ON o.competition_type_seq = c.seq",
        []
      );
      reply.code(200).send(result[0]);
    } catch (error) {
      reply.code(503).send(error);
    }
  });

  fastify.post("/", async (request, reply) => {
    try {
      const connection = await fastify.mysql.getConnection();

      const data = request.body;

      const query =
        "INSERT INTO offtherecord (user_id, title, complete_status, competition_type_seq, reg_date) VALUES (?, ?, ?, ?, NOW())";
      const values = [
        data.user_id,
        data.title,
        data.complete_status,
        data.competition_type_seq,
      ];

      const result = await connection.query(query, values);

      reply.code(201).send(result);
    } catch (error) {
      reply.code(503).send(error);
    }
  });
};
