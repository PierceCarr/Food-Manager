'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('items', {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        // unique: "nameUnitConstraint"
      },
      unitOfMeasure: {
        type: Sequelize.STRING,
        allowNull: false,
        // unique: "nameUnitConstraint"
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tag: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      quantity: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
      },
      price: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
    })
    .then(() => queryInterface.addConstraint('items', ['name', "unitOfMeasure"], {
      type: 'unique',
      name: 'nameUnitConstraint'
    }))
    .then(() => queryInterface.bulkInsert('items', [
      {
        name: "Pumpkin",
        unitOfMeasure: "Slice",
        category: "Desserts",
        tag: "Cheesecake",
        quantity: 0.0,
        price: 2.50,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
      {
        name: "Chocolate",
        unitOfMeasure: "Slice",
        category: "Desserts",
        tag: "Cheesecake",
        quantity: 0.0,
        price: 2.50,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      }
      ], {}));
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.dropTable('items');
  }
};
