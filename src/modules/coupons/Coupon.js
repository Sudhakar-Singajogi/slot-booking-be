const Sequelize = require("sequelize");
const path = require("path");
const sequelize = require(path.resolve("src/dbconn/connection"));

module.exports = sequelize.define("coupons", {
    couponId: {
      type: Sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },
    arena_id:{
      type: Sequelize.STRING(300),
      allowNull: false, 
    },
    couponName: {
      type: Sequelize.STRING(300),
      allowNull: false,
    },
    offer: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
    },
    offerStartsAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    offerEndAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    status: {
      type: Sequelize.ENUM("1", "0"),
      allowNull: false,
      defaultValue: "0",
    }, 
  });
