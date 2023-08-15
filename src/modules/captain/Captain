const Sequelize = require("sequelize");
const path = require("path");
const sequelize = require(path.resolve("src/dbconn/connection"));

module.exports = sequelize.define("captains", {
    captainId: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },       
      captain_name: {
        type: Sequelize.STRING(256),
        allowNull: false, 
      },
      captain_email: {
        type: Sequelize.STRING(256),
        allowNull: false, 
      },
      captain_contact: {
        type: Sequelize.STRING(256),
        allowNull: false, 
      },
      total_bookings: {
        type: Sequelize.INTEGER(11),
        allowNull: false, 
      },
      earned_points: {
        type: Sequelize.INTEGER(11),
        allowNull: false, 
      },
      status: {
        type: Sequelize.ENUM("1", "0"),
        allowNull: false,
        defaultValue: "1",
      },
});
