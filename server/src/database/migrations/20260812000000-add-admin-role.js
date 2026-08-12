'use strict';

/**
 * Splits administrator access into two levels.
 *
 * Every existing row keeps the restricted `admin` default, which is also the
 * default for any account created later. The super administrator is promoted
 * (or created) by the seeder on the next boot, so this migration never grants
 * elevated access on its own.
 *
 * @type {import('sequelize-cli').Migration}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('admins');
    if (table.role) {
      // Already applied — either by this migration or by a development sync.
      return;
    }

    // A previous deployment may have failed after Postgres created the ENUM
    // type but before the column existed. Nothing can reference the type at
    // this point, so clearing it keeps the retry idempotent.
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_admins_role";');

    await queryInterface.addColumn('admins', 'role', {
      type: Sequelize.ENUM('super-admin', 'admin'),
      allowNull: false,
      defaultValue: 'admin',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('admins', 'role');
    // Postgres keeps the ENUM type behind once its last column is dropped.
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_admins_role";');
  },
};
