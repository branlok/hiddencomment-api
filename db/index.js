require("dotenv").config();
const { Pool } = require("pg");

if (process.env.NODE_ENV == 'development') 

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    `postgresql://${process.env.PGUSER}:${process.env.PASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`,
  // ssl: { rejectUnauthorized: false }, <REQUIRED FOR HEROKU SETTINGS>
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  //ssl: process.env.DATABASE_URL ? true : false
});

module.exports = {
  pool: pool,
  query: (text, params) => pool.query(text, params),
};
