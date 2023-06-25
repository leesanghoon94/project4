<<<<<<< HEAD
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
    try {
      // Health Check
      if (request.url === "/") {
        return;
      }
      // 1. cogniton 검증 로직 추가
      // 2. 유저아이디, 유저네임 할당
      if (!request.headers.authorization) {
        reply.code(401).send({ status: "Unauthorized" });
        return;
      }

      const token = request.headers.authorization.split(" ")[1];

      // 토큰 검증
      const decoded = await fastify.jwt.verify(token);
      if (!decoded) {
        reply.code(401).send({ status: "Unauthorized" });
        return;
      }
      request.userData = decoded;
    } catch (error) {
      reply.code(401).send({ status: "Unauthorized", msg: error });
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
        console.log(error);
        callback(error);
      }
    },
    algorithms: ["RS256"],
  });

  fastify.register(require("@fastify/mysql"), {
    promise: true,
    connectionString:
      "mysql://root:12345678@terraform-20230622052736232100000001.cxamxtdxagfz.ap-northeast-2.rds.amazonaws.com/RECORD",
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
=======
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
>>>>>>> eeb0d36af23f1788ec7ed1ebae670f5fec5490af
