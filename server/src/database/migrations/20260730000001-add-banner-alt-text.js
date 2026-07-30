'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = new Set(
      (await queryInterface.showAllTables()).map((table) =>
        typeof table === 'string'
          ? table
          : table.tableName || String(table),
      ),
    );

    if (!tables.has('banners')) return;

    const columns = await queryInterface.describeTable('banners');
    if (!columns.altText) {
      await queryInterface.addColumn('banners', 'altText', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    
    if (!columns.targetUrl) {
      await queryInterface.addColumn('banners', 'targetUrl', {
        type: Sequelize.STRING,
        allowNull: true,
      });
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

    if (!tables.has('banners')) return;

    const columns = await queryInterface.describeTable('banners');
    if (columns.altText) {
      await queryInterface.removeColumn('banners', 'altText');
    }
    
    // We intentionally don't remove targetUrl here if it was added by a previous migration,
    // to avoid conflict with the down method of 20260725000003.
  },
};
