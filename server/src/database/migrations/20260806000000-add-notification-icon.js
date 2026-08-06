'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('notifications');
    if (!tableInfo.icon) {
      await queryInterface.addColumn('notifications', 'icon', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface) => {
    const tableInfo = await queryInterface.describeTable('notifications');
    if (tableInfo.icon) {
      await queryInterface.removeColumn('notifications', 'icon');
    }
  },
};
