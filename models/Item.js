const { sequelize, DataTypes } = require("../db");

const Item = sequelize.define(
  "Item",
  {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    price: DataTypes.INTEGER,
    vegetarian: DataTypes.BOOLEAN,
  },
  {
    freezeTableName: true,
  }
);

module.exports = { Item };
