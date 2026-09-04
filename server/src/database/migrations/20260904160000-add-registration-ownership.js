'use strict';

/** Adds ownership to course enquiries and enforces the authenticated-user
 * scholarship invariant without deleting or merging existing submissions. */
module.exports = {
  async up(queryInterface, Sequelize) {
    const course = await queryInterface.describeTable('course_registrations');
    if (!course.userId) {
      await queryInterface.addColumn('course_registrations', 'userId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }

    const scholarship = await queryInterface.describeTable('scholarship_registrations');
    if (!scholarship.userId) {
      await queryInterface.addColumn('scholarship_registrations', 'userId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }

    // Do not make an existing deployment fail (or discard data) if historical
    // rows already contain duplicate user IDs. New rows remain race-safe once
    // the data has been reviewed and the unique index can be created.
    const [duplicates] = await queryInterface.sequelize.query(
      'SELECT "userId" FROM scholarship_registrations WHERE "userId" IS NOT NULL GROUP BY "userId" HAVING COUNT(*) > 1 LIMIT 1;',
    );
    if (duplicates.length === 0) {
      await queryInterface.sequelize.query(
        'CREATE UNIQUE INDEX IF NOT EXISTS scholarship_registrations_user_id_unique ON scholarship_registrations ("userId") WHERE "userId" IS NOT NULL;',
      );
    }
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      'DROP INDEX IF EXISTS scholarship_registrations_user_id_unique;',
    );
    // Ownership columns are intentionally retained on rollback to avoid
    // destructive loss of associations created after this migration.
  },
};
