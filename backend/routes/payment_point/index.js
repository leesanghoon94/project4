"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/", async (request, reply) => {
    try {
      const connection = await fastify.mysql.getConnection();
      const result = await connection.query("SELECT * FROM payment_point", []);

      reply.code(200).send(result[0]);
    } catch (error) {
      reply.code(500).send(error);
    }
  });
};
