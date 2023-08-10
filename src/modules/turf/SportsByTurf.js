const Sequelize = require("sequelize");
const path = require("path");
const sequelize = require(path.resolve("src/dbconn/connection"));

module.exports = sequelize.define("sportsbyturves", {
    sportsbyturfId: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      turfid:{
        type: Sequelize.INTEGER(11),
        allowNull: false, 
      },
      sport:{
        type: Sequelize.STRING(256),
        allowNull: false,
        
      },
});



