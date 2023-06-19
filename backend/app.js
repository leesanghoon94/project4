"use strict";

const path = require("path");
const AutoLoad = require("@fastify/autoload");
const offtherecord = require("./routes/offtherecord/index");
const competition = require("./routes/competition/index");
const competition_type = require("./routes/competition_type/index");
const payment_point = require("./routes/payment_point/index");

// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {};

module.exports = async function (fastify, opts) {
  // Place here your custom code!
  fastify.addHook("preHandler", async (request, reply) => {
    const auth = request.headers.authorization;
    // 1. cogniton 검증 로직 추가
    // 2. 유저아이디, 유저네임 할당

    if (false) {
      reply.code(401).send({ status: "Unauthorized" });
    }
  });

  fastify.register(require("@fastify/mysql"), {
    promise: true,
    connectionString:
      "mysql://root:12345678@terraform-20230619024655981100000001.cxamxtdxagfz.ap-northeast-2.rds.amazonaws.com",
  });

  fastify.register(offtherecord);
  fastify.register(competition);
  fastify.register(competition_type);
  fastify.register(payment_point);

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });
};
