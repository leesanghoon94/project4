"use strict";

module.exports = async function (fastify, opts) {
  /**
   * @api {post} /competitions Create a competition
   * @apiName 특정대화 참가신청
   */
  fastify.post("/:competitionid/participants", async function (request, reply) {
    try {
      const connection = await fastify.mysql.getConnection();
      const { competitionid } = request.params;

      const result = await connection.query(
        `
      INSERT INTO participant (competition_seq, user_id, user_name, reg_date)
      VALUES (?, ?, ?, NOW());
    `,
        [competitionid, "", ""]
      );

      console.log(result);

      reply.code(201).send({ status: "Created" });
    } catch (e) {}
  });

  /**
   * @api {get} /competitions Get all competitions
   * @apiName 특정대회 참가신청 조회
   */
  fastify.get("/:competitionid/participants", async function (request, reply) {
    try {
      const connection = await fastify.mysql.getConnection();
      const { competitionid } = request.params;

      const [rows, fields] = await connection.query(
        `
      SELECT * FROM participant as A 
        LEFT JOIN competition
      WHERE competition_seq = ?;
    `,
        [competitionid]
      );

      reply.code(200).send(rows);
    } catch (e) {}
  });

  /**
   * @api {get} Get records of a competition
   * @apiName 공식기록 조회
   */
  fastify.get("/:competitionid/record", async function (request, reply) {
    try {
      const connection = await fastify.mysql.getConnection();
      const { competitionid } = request.params;

      const [rows, fields] = await connection.query(
        `
      SELECT * FROM record as A 
      WHERE competition_seq = ?;
    `,
        [competitionid]
      );

      reply.code(200).send(rows);
    } catch (e) {}
  });

  /**
   * @api {post} Post records of a competition
   * @apiName 공식기록 등록
   */
  fastify.post("/:competitionid/record", async function (request, reply) {
    try {
      const connection = await fastify.mysql.getConnection();
      const { competitionid } = request.params;
      const { participant_seq, complete_status, competition_type_seq } =
        request.body;

      const result = await connection.query(
        `
      INSERT INTO record (competition_seq, participant_seq, complete_status, competition_type_seq, reg_date)
      VALUES (?, ?, ?, ?, NOW());
    `,
        [competitionid, participant_seq, complete_status, competition_type_seq]
      );

      console.log(result);

      reply.code(201).send({ status: "Created" });
    } catch (e) {}
  });
};
