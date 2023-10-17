const { sequelize, DataTypes } = require("../db");
const { Sequelize } = require("sequelize");

const Menu = sequelize.define("Restaurant", {
  title: DataTypes.STRING,
});

module.exports = { Menu };
