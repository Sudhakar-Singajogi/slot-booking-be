"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    queryInterface.createTable("bookings", {
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
      gameid: {
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
      booked_at: {
        type: Sequelize.STRING(300),
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
    queryInterface.dropTable("bookings");
  },
};
