const Sequelize = require("sequelize");
const path = require("path");
const sequelize = require(path.resolve("src/dbconn/connection"));

module.exports = sequelize.define("turfdetails", {
  turfId: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  arena_id: {
    type: Sequelize.STRING(300),
    allowNull: false,
  },
  turf_name: {
    type: Sequelize.STRING(256),
    allowNull: false,
  },
  areana_size: {
    type: Sequelize.STRING(256),
    allowNull: false,
  },
  weekdays_cost: {
    type: Sequelize.INTEGER(11),
    allowNull: true,
  },
  weekends_cost: {
    type: Sequelize.INTEGER(11),
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM("1", "0"),
    allowNull: false,
    defaultValue: "0",
  },
});
