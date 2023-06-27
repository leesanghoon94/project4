"use strict";

module.exports = async function (fastify, opts) {
  /**
   * @api {get} /competitions Get all competitions
   * @apiName 대회 목록 조회
   */
  fastify.get("/", async (request, reply) => {
    try {
      const connection = await fastify.mysql.getConnection();

      const result = await connection.query("SELECT * FROM competition", []);
      reply.code(200).send(result[0]);
    } catch (error) {
      reply.code(500).send(error);
    }
  });

  /**
   * @api {post} /competitions Create a competition
   * @apiName 특정대화 참가신청
   */
  fastify.post("/:competitionid/participants", async function (request, reply) {
    try {
      if (request.userData.group !== "anonymous") {
        reply.code(401).send({ message: "Unauthorized Menu" });
        return;
      }
      const connection = await fastify.mysql.getConnection();
      const { competitionid } = request.params;

      const [existingUser] = await connection.query(
        `
        SELECT * FROM participant
        WHERE competition_seq = ? AND user_id = ?;`,
        [competitionid, request.userData.email]
      );

      if (existingUser.length > 0) {
        reply.code(400).send({ status: "이미 신청한 대회가 있습니다." });
        return;
      }

      const result = await connection.query(
        `
      INSERT INTO participant (competition_seq, user_id, user_name, reg_date)
      VALUES (?, ?, ?, NOW());
    `,
        [competitionid, request.userData.email, request.userData.name]
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
        LEFT JOIN competition as B
          ON A.competition_seq = B.seq
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
      if (request.userData.group !== "administrator") {
        reply.code(401).send({ message: "Unauthorized Menu" });
        return;
      }
      const connection = await fastify.mysql.getConnection();
      const { competitionid } = request.params;

      const [rows, fields] = await connection.query(
        `
      SELECT C.type_name, B.user_id, B.user_name, A.complete_status, A.reg_date
      FROM record as A 
      INNER JOiN participant as B
        ON A.participant_seq = B.seq
      INNER JOIN competition_type as C
        ON A.competition_type_seq = C.seq
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
      if (request.userData.group !== "administrator") {
        reply.code(401).send({ message: "Unauthorized Menu" });
        return;
      }
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
