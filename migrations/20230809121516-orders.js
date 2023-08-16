"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable("orders", {
      orderId: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      orderCreationId: {
        type: STRING(256),
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
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable("orders");
  },
};
