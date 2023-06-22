"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/", (request, reply) => {
    reply
      .code(200)
      .send({ message: "마라톤대회 기록관리 시스템에 오신걸 환영합니다." });
  });
};
