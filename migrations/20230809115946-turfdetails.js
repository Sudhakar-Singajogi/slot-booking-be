'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    queryInterface.createTable("turfdetails", {
      turfId: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      arena_id:{
        type: Sequelize.STRING(300),
        allowNull: false, 
      },
      turf_name:{
        type: Sequelize.STRING(256),
        allowNull: false,
        
      },
      areana_size:{
        type: Sequelize.STRING(256),
        allowNull: false,
        
      },
      weekdays_cost:{
        type: Sequelize.INTEGER(11),
        allowNull: true,
      },
      weekends_cost:{
        type: Sequelize.INTEGER(11),
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

    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable("turfdetails");
  }
};
