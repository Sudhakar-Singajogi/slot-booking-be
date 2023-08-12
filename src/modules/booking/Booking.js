const Sequelize = require("sequelize");
const path = require("path");
const sequelize = require(path.resolve("src/dbconn/connection"));

module.exports = sequelize.define("bookings", {
    bookingId: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      arena_id: {
        type: Sequelize.STRING(300),
        allowNull: false, 
      },
      turfid: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      booked_by: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      booked_on: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      total_hrs: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
      },
      is_weekend: {
        type: Sequelize.ENUM("1", "0"),
        allowNull: false,
        defaultValue: "0",
      },
      status: {
        type: Sequelize.ENUM("1", "0"),
        allowNull: false,
        defaultValue: "0",
      },
});






