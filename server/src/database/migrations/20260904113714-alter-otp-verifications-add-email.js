'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop existing records since they don't have emails and are ephemeral OTPs
    await queryInterface.sequelize.query('TRUNCATE TABLE otp_verifications CASCADE');

    // Add email column
    await queryInterface.addColumn('otp_verifications', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // We can also remove mobileNumber column if it exists
    try {
      await queryInterface.removeColumn('otp_verifications', 'mobileNumber');
    } catch (e) {
      // Column might not exist
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('otp_verifications', 'mobileNumber', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.removeColumn('otp_verifications', 'email');
  }
};
