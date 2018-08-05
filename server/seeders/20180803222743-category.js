'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('categories', {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        unique: true
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('categories');
  }
};
