'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('scholarship_registrations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      studentName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      studentPhone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      parentPhone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      studentClass: {
        type: Sequelize.STRING,
        allowNull: false
      },
      schoolName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false
      },
      preferredCourse: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('scholarship_registrations');
  }
};
