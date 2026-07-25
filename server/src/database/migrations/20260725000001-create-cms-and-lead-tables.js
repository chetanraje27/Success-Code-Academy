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

    const timestamps = {
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE },
    };

    if (!existingTables.has('contact_messages')) {
      await queryInterface.createTable('contact_messages', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: { type: Sequelize.STRING, allowNull: false },
        email: { type: Sequelize.STRING, allowNull: false },
        phone: { type: Sequelize.STRING, allowNull: false },
        message: { type: Sequelize.TEXT, allowNull: false },
        ...timestamps,
      });
    }

    if (!existingTables.has('course_registrations')) {
      await queryInterface.createTable('course_registrations', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        courseTitle: { type: Sequelize.STRING, allowNull: false },
        studentName: { type: Sequelize.STRING, allowNull: false },
        studentEmail: { type: Sequelize.STRING, allowNull: false },
        studentPhone: { type: Sequelize.STRING, allowNull: false },
        visitingDate: { type: Sequelize.STRING, allowNull: false },
        visitingTime: { type: Sequelize.STRING, allowNull: false },
        ...timestamps,
      });
    }

    if (!existingTables.has('banners')) {
      await queryInterface.createTable('banners', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        type: {
          type: Sequelize.ENUM('HOME', 'RESULTS'),
          allowNull: false,
          defaultValue: 'HOME',
        },
        image: { type: Sequelize.STRING, allowNull: false },
        altText: { type: Sequelize.STRING, allowNull: true },
        targetUrl: { type: Sequelize.STRING, allowNull: true },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        orderIndex: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        ...timestamps,
      });
    } else {
      const banners = await queryInterface.describeTable('banners');
      if (!banners.targetUrl) {
        await queryInterface.addColumn('banners', 'targetUrl', {
          type: Sequelize.STRING,
          allowNull: true,
        });
      }
    }

    if (!existingTables.has('notifications')) {
      await queryInterface.createTable('notifications', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        text: { type: Sequelize.STRING, allowNull: false },
        link: { type: Sequelize.STRING, allowNull: true },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        orderIndex: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        ...timestamps,
      });
    }

    if (!existingTables.has('star_students')) {
      await queryInterface.createTable('star_students', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: { type: Sequelize.STRING, allowNull: false },
        score: { type: Sequelize.STRING, allowNull: false },
        rank: { type: Sequelize.STRING, allowNull: false },
        course: { type: Sequelize.STRING, allowNull: false },
        year: { type: Sequelize.STRING, allowNull: false },
        image: { type: Sequelize.STRING, allowNull: false },
        colorHex: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '#2c3e7a',
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        orderIndex: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        ...timestamps,
      });
    }

    if (!existingTables.has('site_settings')) {
      await queryInterface.createTable('site_settings', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        key: { type: Sequelize.STRING, allowNull: false, unique: true },
        value: {
          type: Sequelize.TEXT,
          allowNull: false,
          defaultValue: '',
        },
        ...timestamps,
      });
    }

    if (!existingTables.has('topper_results')) {
      await queryInterface.createTable('topper_results', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: { type: Sequelize.STRING, allowNull: false },
        image: { type: Sequelize.STRING, allowNull: false },
        year: { type: Sequelize.INTEGER, allowNull: false },
        college: { type: Sequelize.STRING, allowNull: true },
        city: { type: Sequelize.STRING, allowNull: true },
        marks: { type: Sequelize.INTEGER, allowNull: true },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        orderIndex: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        ...timestamps,
      });
    }

    await queryInterface.sequelize.query(
      'CREATE INDEX IF NOT EXISTS banners_active_type_order_idx ON banners ("isActive", type, "orderIndex");',
    );
    await queryInterface.sequelize.query(
      'CREATE INDEX IF NOT EXISTS notifications_active_order_idx ON notifications ("isActive", "orderIndex");',
    );
    await queryInterface.sequelize.query(
      'CREATE INDEX IF NOT EXISTS star_students_active_order_idx ON star_students ("isActive", "orderIndex");',
    );
    await queryInterface.sequelize.query(
      'CREATE INDEX IF NOT EXISTS topper_results_active_year_order_idx ON topper_results ("isActive", year, "orderIndex");',
    );
  },

  down: async (queryInterface) => {
    // These tables may predate the migration because older deployments used
    // `sequelize.sync`. Never drop potentially live CMS or lead data during a
    // rollback; only remove indexes introduced here.
    await queryInterface.sequelize.query(
      'DROP INDEX IF EXISTS topper_results_active_year_order_idx;',
    );
    await queryInterface.sequelize.query(
      'DROP INDEX IF EXISTS star_students_active_order_idx;',
    );
    await queryInterface.sequelize.query(
      'DROP INDEX IF EXISTS notifications_active_order_idx;',
    );
    await queryInterface.sequelize.query(
      'DROP INDEX IF EXISTS banners_active_type_order_idx;',
    );
  },
};
