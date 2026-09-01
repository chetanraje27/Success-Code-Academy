'use strict';

/**
 * Repairs schema/metadata divergence where SequelizeMeta records the earlier
 * add-column migrations as applied while the physical columns are missing
 * (tables were created by `sequelize.sync` before those migrations ran).
 *
 * Guarded and idempotent: each column is added only when absent.
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

  down: async (queryInterface) => {
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
