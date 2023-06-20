"use strict";

const path = require("path");
const AutoLoad = require("@fastify/autoload");
const jwt = require("fastify-jwt");
const axios = require("axios");
const jwkToPem = require("jwk-to-pem");

const region = "ap-northeast-2";
const userPoolId = "ap-northeast-2_nJ12kwmzP";

// Pass --options via CLI arguments in command to enable these options.
module.exports.options = {};

module.exports = async function (fastify, opts) {
  // Place here your custom code!
  fastify.addHook("preHandler", async (request, reply) => {
    const auth = request.headers.authorization;
    // 1. cogniton 검증 로직 추가
    // 2. 유저아이디, 유저네임 할당
    const token = request.headers.authorization.split(" ")[1];

    // 토큰 검증
    const decoded = await fastify.jwt.verify(token);

    console.log(decoded);

    if (false) {
      reply.code(401).send({ status: "Unauthorized" });
    }
  });

  fastify.register(jwt, {
    decode: { complete: true },
    secret: async (token, callback, a, b, c, d) => {
      try {
        const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
        const response = await axios.get(url);
        const keys = response.data.keys;
        const key = keys.find((k) => k.kid === token.kid);

        const pem = jwkToPem(key);

        callback(null, pem);
      } catch (error) {
        callback(error);
      }
    },
    algorithms: ["RS256"],
  });

  fastify.register(require("@fastify/mysql"), {
    promise: true,
    connectionString:
      "mysql://root:12345678@terraform-20230619024655981100000001.cxamxtdxagfz.ap-northeast-2.rds.amazonaws.com/RECORD",
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
