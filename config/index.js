require('dotenv').config();

const { PORT, DEBUG_MODE, DB_URL, JWT_SECRET,REFRESH_SECRET } = process.env;

module.exports = {
  PORT,
  DEBUG_MODE,
  DB_URL,
  JWT_SECRET,
  REFRESH_SECRET,

};
