'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('items', {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: 'nameQtyIndex'
      },
      qty: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
        unique: 'nameQtyIndex'
      },
      unitOfMeasure: {
        type: Sequelize.STRING,
        allowNull: false
      },
      price: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.dropTable('Items');
  }
};
