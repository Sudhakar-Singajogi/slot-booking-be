'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    queryInterface.createTable("captains", {
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
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },

    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable("captains");
  }
};
