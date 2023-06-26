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
