require("../utils/imports.util").dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  DB_SYNC: process.env.DB_SYNC,
  FLIGHT_SERVICE_URL: process.env.FLIGHT_SERVICE_URL,
};
