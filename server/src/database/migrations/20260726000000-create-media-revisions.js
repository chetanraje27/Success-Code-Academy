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

    if (!tables.has('media_revisions')) {
      await queryInterface.createTable('media_revisions', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        resourceType: {
          allowNull: false,
          type: Sequelize.ENUM('banner', 'star', 'result'),
        },
        resourceId: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        action: {
          allowNull: false,
          type: Sequelize.ENUM('update', 'delete', 'restore'),
        },
        snapshot: {
          allowNull: false,
          type: Sequelize.JSONB,
        },
        createdBy: {
          allowNull: true,
          type: Sequelize.INTEGER,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      });
    }

    await queryInterface.sequelize.query(
      'CREATE INDEX IF NOT EXISTS media_revisions_resource_history_idx ON media_revisions ("resourceType", "resourceId", "createdAt" DESC);',
    );
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(
      'DROP INDEX IF EXISTS media_revisions_resource_history_idx;',
    );
    await queryInterface.dropTable('media_revisions');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_media_revisions_resourceType";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_media_revisions_action";',
    );
  },
};
