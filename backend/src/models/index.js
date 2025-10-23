const sequelize = require("../config/dbConfig");
const Player = require("./player");

const db = { sequelize, Player };

module.exports = db;
