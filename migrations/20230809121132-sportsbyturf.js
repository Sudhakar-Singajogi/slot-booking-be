'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    queryInterface.createTable("sportsbyturves", {
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
    queryInterface.dropTable("sportsbyturves");
  }
};
