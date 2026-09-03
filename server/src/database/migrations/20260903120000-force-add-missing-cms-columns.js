'use strict';

/**
 * Force-adds the CMS columns that SequelizeMeta already records as applied
 * while the physical columns are missing (notifications.icon and
 * banners.targetUrl). Earlier add-column and repair migrations are recorded
 * in SequelizeMeta, so db:migrate skips them forever; this migration carries
 * an unrecorded timestamp so it actually executes.
 *
 * Guarded and idempotent: each column is added only when absent, so running
 * it against a healthy database is a no-op.
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = new Set(
      (await queryInterface.showAllTables()).map((table) =>
        typeof table === 'string'
          ? table
          : table.tableName || String(table),
      ),
    );

    if (tables.has('notifications')) {
      const columns = await queryInterface.describeTable('notifications');
      if (!columns.icon) {
        await queryInterface.addColumn('notifications', 'icon', {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }
    }

    if (tables.has('banners')) {
      const columns = await queryInterface.describeTable('banners');
      if (!columns.targetUrl) {
        await queryInterface.addColumn('banners', 'targetUrl', {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tables = new Set(
      (await queryInterface.showAllTables()).map((table) =>
        typeof table === 'string'
          ? table
          : table.tableName || String(table),
      ),
    );

    if (tables.has('notifications')) {
      const columns = await queryInterface.describeTable('notifications');
      if (columns.icon) {
        await queryInterface.removeColumn('notifications', 'icon');
      }
    }

    if (tables.has('banners')) {
      const columns = await queryInterface.describeTable('banners');
      if (columns.targetUrl) {
        await queryInterface.removeColumn('banners', 'targetUrl');
      }
    }
  },
};
