'use strict';

/**
 * Single-use, hashed password reset tokens for administrator accounts.
 * Only the SHA-256 of each token is stored, so the table cannot be replayed.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // In case a previous deployment failed midway, ensure a clean slate
    await queryInterface.sequelize.query('DROP TABLE IF EXISTS "admin_password_resets" CASCADE;');

    await queryInterface.createTable('admin_password_resets', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      adminId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'admins', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      tokenHash: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      usedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      requestedByAdminId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'admins', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex('admin_password_resets', ['adminId']);
    await queryInterface.addIndex('admin_password_resets', ['expiresAt']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('admin_password_resets');
  },
};
