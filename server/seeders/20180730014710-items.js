'use strict';
//Max $100,000.00 per ingredient price
const CURRENCY_PRECISION = 8; //Significant digits on either side of .
const CURRENCY_SCALE = 2; //Allowable digits to the right of .
module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('categories', {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      tags: {
        type: Sequelize.ARRAY({
          type: Sequelize.STRING,
          unique: true
        }),
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        default: true
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      },
    })
    .then(() => queryInterface.bulkInsert('categories', [
      {
        name: "Breads",
        tags: ["Bread", "Torts"]
      },
      {
        name: "Dairy",
        tags: ["Cheese", "Eggs", "Butter"]
      },
      {
        name: "Desserts",
        tags: ["Cheesecake", "Ice Cream"]
      },
      {
        name: "Frozen",
        tags: ["Shrimp", "Edamame"]
      },
      {
        name: "Meats",
        tags: ["Back Ribs", "Bacon", "Burgers", "Carapacchio", "Chicken"]
      },
      {
        name: "Produce",
        tags: ["Avacado", "Broccoli", "Cabbage", "Garlic", "Herbs", "Lettuce",
          "Mushrooms", "Onions", "Papaya", "Pepper", "Peppers", "Potatoes",
          "Shallots", "Tomatoes"]
      }
      ], {})
    )
    .then(() => queryInterface.createTable('items', {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      unitOfMeasurement: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {model: 'categories', key: 'name'}
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
        type: Sequelize.DECIMAL(CURRENCY_PRECISION, CURRENCY_SCALE),
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
    }))
    .then(() => queryInterface.addConstraint('items', ['name', "unitOfMeasurement"], 
    {
      type: 'unique',
      name: 'nameUnitConstraint'
    }))
    .then(() => queryInterface.bulkInsert('items', [
      {
        name: "Pumpkin",
        unitOfMeasurement: "Slice",
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
        unitOfMeasurement: "Slice",
        category: "Desserts",
        tag: "Cheesecake",
        quantity: 0.0,
        price: 2.50,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
    ], {}));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('items')
    .then(() => queryInterface.dropTable('categories'));
  }
};
