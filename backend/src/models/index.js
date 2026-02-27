const sequelize = require("../config/dbConfig");
const { DataTypes } = require("sequelize");

const Player = require("./player")(sequelize, DataTypes);

const db = {
    sequelize,
    Player
};

module.exports = db;
