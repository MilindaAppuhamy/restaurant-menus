const { sequelize, DataTypes } = require("../db");
const { Sequelize } = require("sequelize");

const Restaurant = sequelize.define("Restaurant", {
  name: DataTypes.STRING,
  location: DataTypes.STRING,
  cuisine: DataTypes.STRING,
});

module.exports = { Restaurant };
