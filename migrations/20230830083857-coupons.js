'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable("coupons", {
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
        type: Sequelize.FLOAT(2),
        allowNull: false,
      },
      offerStartsAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      offerEndAt: {
        type: Sequelize.DATE,
        allowNull: true,
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

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable("coupons");
  }
};
