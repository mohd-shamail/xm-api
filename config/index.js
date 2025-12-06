require('dotenv').config();

const { PORT, DEBUG_MODE, DB_URL, DB_URL_DEV, JWT_SECRET, REFRESH_SECRET } = process.env;

module.exports = {
  PORT,
  DEBUG_MODE,
  DB_URL,
  DB_URL_DEV,
  JWT_SECRET,
  REFRESH_SECRET,

};
