"use strict";

const path = require("path");
const AutoLoad = require("@fastify/autoload");

// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {};

module.exports = async function (fastify, opts) {
  // Place here your custom code!
  fastify.addHook("preHandler", async (request, reply) => {
    const auth = request.headers.authorization;
    // 1. cogniton 검증 로직 추가
    // 2. 유저아이디, 유저네임 할당

    console.log(fastify.cognito.verify(request));
    if (false) {
      reply.code(401).send({ status: "Unauthorized" });
    }
  });

  fastify.register(require("fastify-aws-cognito"), {
    region: "ap-northeast-2",
    userPoolId: "ap-northeast-2_ofcEHq7sV",
    //ClientId: "5srdvlu3c69robc3f922tb0ctv",
  });

  fastify.register(require("@fastify/mysql"), {
    promise: true,
    connectionString:
      "mysql://root:12345678@terraform-20230619024655981100000001.cxamxtdxagfz.ap-northeast-2.rds.amazonaws.com",
  });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });
};
