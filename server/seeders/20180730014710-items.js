'use strict';
//Max $100,000.00 per ingredient price
const CURRENCY_PRECISION = 8; //Significant digits on either side of .
const CURRENCY_SCALE = 2; //Allowable digits to the right of .
module.exports = {

  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('categories', {
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
    });

    await queryInterface.bulkInsert('categories', [
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

    await queryInterface.createTable('periods', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      month: {
        type: Sequelize.INTEGER,
        validate: {
          max: 12,
          min: 1
        },
        unique: "monthWeekConstraint",
      },
      week: {
        type: Sequelize.INTEGER,
        validate: {
          max: 4,
          min: 1
        },
        unique: "monthWeekConstraint",
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });

    await queryInterface.bulkInsert('periods', [
        {
          month: 1,
          week: 4,
          createdAt: Sequelize.fn('now'),
          updatedAt: Sequelize.fn('now')
        },
        {
          month: 2,
          week: 2,
          createdAt: Sequelize.fn('now'),
          updatedAt: Sequelize.fn('now')
        },
        {
          month: 8,
          week: 2,
          createdAt: Sequelize.fn('now'),
          updatedAt: Sequelize.fn('now')
        },
        {
          month: 8,
          week: 3,
          createdAt: Sequelize.fn('now'),
          updatedAt: Sequelize.fn('now')
        }
    ]);

    await queryInterface.createTable('items', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: "nameUnitConstraint"
      },
      unitOfMeasurement: {
        type: Sequelize.STRING,
        allowNull: false,
        // primaryKey: "nameUnitConstraint"
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
        validate: {
          min: 0
        }
      },
      price: {
        type: Sequelize.DECIMAL(CURRENCY_PRECISION, CURRENCY_SCALE),
        defaultValue: 0,
        validate: {
          min: 0
        }
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
      }
    });

    await queryInterface.addConstraint('items', ['name', "unitOfMeasurement"], 
    {
      type: 'unique',
      name: 'nameUnitConstraint'
    });

    // .then(() => queryInterface.addIndex('nameUnitIndex', ['name', "unitOfMeasurement"]))
    await queryInterface.bulkInsert('items', [
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
        quantity: 4,
        price: 3.50,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
      {
        name: "Vanilla",
        unitOfMeasurement: "Tub",
        category: "Desserts",
        tag: "Ice Cream",
        quantity: "10",
        price: 5.00,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      }
    ], {});

    await queryInterface.createTable('periodItems', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      itemId: {
        type: Sequelize.INTEGER,
        references: {model: 'items', key: 'id'}
      },
      periodId: {
        type: Sequelize.INTEGER,
        references: {model: 'periods', key: 'id'}
      },
      day: {
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
          max: 7
        }
      },
      isAM: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      isSubmitted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
      },
      price: {
        type: Sequelize.DECIMAL(CURRENCY_PRECISION, CURRENCY_SCALE),
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      quantity: {
        type: Sequelize.FLOAT,
        defaultValue: 0.0,
        validate: {
          min: 0
        }
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });

    const items = await queryInterface.sequelize.query('SELECT * FROM items;', 
          {type: queryInterface.sequelize.QueryTypes.SELECT});

    const periods = await queryInterface.sequelize.query('SELECT * FROM periods;',
          {type: queryInterface.sequelize.QueryTypes.SELECT});

    const periodItemsToAdd = [];

    periods.forEach((period) => {
      items.forEach((item) => {
        for(let weekday = 1; weekday <= 7; weekday++){
          const amPeriodItem = {};
          const pmPeriodItem = {};

          amPeriodItem.periodId = period.id;
          pmPeriodItem.periodId = period.id;
          amPeriodItem.itemId = item.id;
          pmPeriodItem.itemId = item.id;
          amPeriodItem.day = weekday;
          pmPeriodItem.day = weekday;
          amPeriodItem.quantity = item.quantity;
          pmPeriodItem.quantity = item.quantity;
          amPeriodItem.price = item.price;
          pmPeriodItem.price = item.price;
          amPeriodItem.isAM = true;
          pmPeriodItem.isAM = false;
          amPeriodItem.isSubmitted = false;
          pmPeriodItem.isSubmitted = false;
          amPeriodItem.createdAt = Sequelize.fn('now');
          pmPeriodItem.createdAt = Sequelize.fn('now');

          periodItemsToAdd.push(amPeriodItem);
          periodItemsToAdd.push(pmPeriodItem);
        }
      })
    })

    // periodItemsToAdd.forEach((itemToAdd) => console.log(itemToAdd));

    await queryInterface.bulkInsert('periodItems', periodItemsToAdd);
    // .catch((err) => console.log(err));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('periodItems')
    .then(() => queryInterface.dropTable('items'))
    .then(() => queryInterface.dropTable('categories'))
    .then(() => queryInterface.dropTable('periods'));
  }
};
