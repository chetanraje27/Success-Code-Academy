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
    
    if (!columns.targetUrl) {
      await queryInterface.addColumn('banners', 'targetUrl', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!columns.altText) {
      await queryInterface.addColumn('banners', 'altText', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface) => {
    // Intentionally left blank to avoid dropping columns if rolled back
  },
};
