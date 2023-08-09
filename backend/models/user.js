require("dotenv").config();
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

const users = seq.define("users", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  registration_date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
});
module.exports = { users };
