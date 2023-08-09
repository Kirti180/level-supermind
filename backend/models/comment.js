const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();
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
const posts = seq.define("posts", {
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: users,
      key: "user_id",
    },
  },
  publication_date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
});
const comments = seq.define("comments", {
  comment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  comment_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: users,
      key: "user_id",
    },
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: posts,
      key: "post_id",
    },
  },
  comment_date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
});

module.exports = { comments };
