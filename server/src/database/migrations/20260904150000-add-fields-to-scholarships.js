'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('scholarship_registrations', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addColumn('scholarship_registrations', 'studentEmail', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('scholarship_registrations', 'scholarshipProgram', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('scholarship_registrations', 'scholarshipProgram');
    await queryInterface.removeColumn('scholarship_registrations', 'studentEmail');
    await queryInterface.removeColumn('scholarship_registrations', 'userId');
  },
};
