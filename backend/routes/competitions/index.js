"use strict";

module.exports = async function (fastify, opts) {
  /**
   * @api {post} /competitions Create a competition
   * @apiName 특정대화 참가신청
   */
  fastify.post("/:competitionid/participants", async function (request, reply) {
    return "this is an example";
  });

  /**
   * @api {get} /competitions Get all competitions
   * @apiName 특정대회 참가신청 조회
   */
  fastify.get("/:competitionid/participants", async function (request, reply) {
    return "this is an example";
  });

  /**
   * @api {get} Get records of a competition
   * @apiName 공식기록 조회
   */
  fastify.get("/:competitionid/record", async function (request, reply) {
    return "this is an example";
  });

  /**
   * @api {post} Post records of a competition
   * @apiName 공식기록 등록
   */
  fastify.post("/:competitionid/record", async function (request, reply) {
    const { complete_status, competition_type_seq } = request.body;
    return "this is an example";
  });
};
