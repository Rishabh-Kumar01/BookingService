const router = require("../utils/imports.util").express.Router();

const v1ApiRoutes = require("./v1/index");

module.exports = (channel) => {
  router.use("/v1", v1ApiRoutes(channel));
  return router;
};
