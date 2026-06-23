require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || "carre_user",
    password: process.env.DB_PASSWORD || "changeme",
    database: process.env.DB_NAME || "carre_ivoire",
    host: process.env.DB_HOST || "database",
    port: Number.parseInt(process.env.DB_PORT || "3306", 10),
    dialect: "mysql",
    dialectOptions: { charset: "utf8mb4" },
  },
  test: {
    username: process.env.DB_USER || "carre_user",
    password: process.env.DB_PASSWORD || "changeme",
    database: `${process.env.DB_NAME || "carre_ivoire"}_test`,
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "3306", 10),
    dialect: "mysql",
    dialectOptions: { charset: "utf8mb4" },
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT || "3306", 10),
    dialect: "mysql",
    dialectOptions: { charset: "utf8mb4" },
    logging: false,
  },
};
