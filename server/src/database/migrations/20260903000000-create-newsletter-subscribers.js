'use strict';

/** Creates the newsletter_subscribers table backing the footer
 *  "Stay Updated" form. Matches the NewsletterSubscriber model:
 *  one row per unique email address, welcome email sent on first
 *  subscribe only. */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('newsletter_subscribers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('newsletter_subscribers');
  }
};
