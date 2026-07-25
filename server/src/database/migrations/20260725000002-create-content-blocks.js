'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const existingTables = new Set(
      (await queryInterface.showAllTables()).map((table) =>
        typeof table === 'string'
          ? table
          : table.tableName || String(table),
      ),
    );

    if (!existingTables.has('content_blocks')) {
      await queryInterface.createTable('content_blocks', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        pageKey: {
          allowNull: false,
          type: Sequelize.STRING(160),
        },
        contentKey: {
          allowNull: false,
          type: Sequelize.STRING(160),
        },
        kind: {
          allowNull: false,
          type: Sequelize.ENUM('text', 'multiline'),
          defaultValue: 'text',
        },
        value: {
          allowNull: false,
          type: Sequelize.TEXT,
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
    }

    await queryInterface.sequelize.query(
      'CREATE UNIQUE INDEX IF NOT EXISTS content_blocks_page_content_unique ON content_blocks ("pageKey", "contentKey");',
    );
    await queryInterface.sequelize.query(
      'CREATE INDEX IF NOT EXISTS content_blocks_page_updated_idx ON content_blocks ("pageKey", "updatedAt");',
    );
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(
      'DROP INDEX IF EXISTS content_blocks_page_updated_idx;',
    );
    await queryInterface.sequelize.query(
      'DROP INDEX IF EXISTS content_blocks_page_content_unique;',
    );
    await queryInterface.dropTable('content_blocks');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_content_blocks_kind";',
    );
  },
};
