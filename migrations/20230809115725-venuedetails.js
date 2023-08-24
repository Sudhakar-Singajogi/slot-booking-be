'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    
    queryInterface.createTable("venuedetails", {
      venueId: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true,
      },
      arena_name:{
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      arena_id:{
        type: Sequelize.STRING(300),
        allowNull: false,
        unique: true,
      },
      manager_email: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },
      arena_manager:{
        type: Sequelize.STRING(256),
        allowNull: false,
        
      },
      arena_location:{
        type: Sequelize.STRING(256),
        allowNull: false,
        
      },
      manager_contact1:{
        type: Sequelize.STRING(256),
        allowNull: true,
      },
      manager_contact2:{
        type: Sequelize.STRING(256),
        allowNull: true,
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
    queryInterface.dropTable("venuedetails");
  }
};
