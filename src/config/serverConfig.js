require("../utils/imports.util").dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  DB_SYNC: process.env.DB_SYNC,
  FLIGHT_SERVICE_URL: process.env.FLIGHT_SERVICE_URL,
  MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
  REMINDER_BINDING_KEY: process.env.REMINDER_BINDING_KEY,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
};
