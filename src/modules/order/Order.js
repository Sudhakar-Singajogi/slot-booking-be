const Sequelize = require("sequelize");
const path = require("path");
const sequelize = require(path.resolve("src/dbconn/connection"));

module.exports = sequelize.define("orders", {
  orderId: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  orderCreationId: {
    type: Sequelize.STRING(256),
    allowNull: false,
  },

  bookingid: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
  turf_cost: {
    type: Sequelize.FLOAT(11),
    allowNull: false,
  },
  advanced_paid: {
    type: Sequelize.FLOAT(11),
    allowNull: false,
  },
  balance_amount: {
    type: Sequelize.FLOAT(11),
    allowNull: false,
  },
  balance_amount_paid: {
    type: Sequelize.FLOAT(11),
    allowNull: true,
  },
  balance_amount_paid_via: {
    type: Sequelize.STRING(121),
    allowNull: true,
  },
  refund_amount: {
    type: Sequelize.FLOAT(11),
    allowNull: false,
  },
  coupon_code: {
    type: Sequelize.STRING(256),
    allowNull: false,
  },
  coupon_amount: {
    type: Sequelize.FLOAT(11),
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM("1", "0"),
    allowNull: false,
    defaultValue: "0",
  },
});
