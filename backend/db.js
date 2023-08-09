const { Sequelize, DataTypes } = require("sequelize");
const seq = new Sequelize(
  "supermind",
  "admin",
  "admin123",
  {
    host: "database-2.cuiswqxciwmz.us-west-2.rds.amazonaws.com",
    dialect:"mysql",
  }
);

module.exports = { seq };
