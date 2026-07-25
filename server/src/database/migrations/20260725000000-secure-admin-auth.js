'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('users');

    if (!table.passwordHash) {
      await queryInterface.addColumn('users', 'passwordHash', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    await queryInterface.sequelize.query(
      'CREATE INDEX IF NOT EXISTS users_role_idx ON users (role);',
    );
    await queryInterface.sequelize.query(
      'CREATE INDEX IF NOT EXISTS users_created_at_idx ON users ("createdAt" DESC);',
    );
    await queryInterface.sequelize.query(
      "CREATE UNIQUE INDEX IF NOT EXISTS users_admin_email_unique ON users (LOWER(email)) WHERE role = 'admin';",
    );
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(
      'DROP INDEX IF EXISTS users_admin_email_unique;',
    );
    await queryInterface.sequelize.query(
      'DROP INDEX IF EXISTS users_created_at_idx;',
    );
    await queryInterface.sequelize.query(
      'DROP INDEX IF EXISTS users_role_idx;',
    );

    const table = await queryInterface.describeTable('users');
    if (table.passwordHash) {
      await queryInterface.removeColumn('users', 'passwordHash');
    }
  },
};
