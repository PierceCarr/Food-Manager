require('dotenv').config();
module.exports = {
  "development": {
    use_env_variable: false,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: 5432,
    dialect: "postgres",
    logging: console.log
  },
  "test": {},
  "production": {}
}
