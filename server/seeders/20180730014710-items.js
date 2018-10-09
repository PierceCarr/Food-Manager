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
          // unique: true
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
        tags: ["Bread", "Tortilla", "Etc."],
        isActive: true,
        createdAt: Sequelize.fn('now'),
      },
      {
        name: "Dairy",
        tags: ["Cheese", "Eggs", "Butter", "Etc."],
        isActive: true,
        createdAt: Sequelize.fn('now'),
      },
      {
        name: "Desserts",
        tags: ["Cheesecake", "Ice Cream", "Etc."],
        isActive: true,
        createdAt: Sequelize.fn('now'),
      },
      {
        name: "Frozen",
        tags: ["Shrimp", "Edamame", "Etc."],
        isActive: true,
        createdAt: Sequelize.fn('now'),
      },
      {
        name: "Meats",
        tags: ["Back Ribs", "Bacon", "Burgers", "Carapacchio", "Chicken", "Etc."],
        isActive: true,
        createdAt: Sequelize.fn('now'),
      },
      {
        name: "Produce",
        tags: ["Avacado", "Broccoli", "Cabbage", "Garlic", "Herbs", "Lettuce",
          "Mushrooms", "Onions", "Papaya", "Pepper", "Peppers", "Potatoes",
          "Shallots", "Tomatoes", "Etc."],
        isActive: true,
        createdAt: Sequelize.fn('now'),
      }
      ], {})

    await queryInterface.createTable('periods', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },

      day: {
        type: Sequelize.INTEGER,
        validate: {
          min: 1,
          max: 7
        }
      },
      endDay: {
        type: Sequelize.INTEGER,
        validate: {
          max: 31,
          min: 1
        }
      },
      generation: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      isAM: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      month: {
        type: Sequelize.INTEGER,
        validate: {
          max: 12,
          min: 1
        },
      },
      primaryPeriod: {
        type: Sequelize.INTEGER,
        unique: "yearPrimaryQuarterConstraint",
      },
      quarterPeriod: {
        type: Sequelize.INTEGER,
        validate: {
          max: 4,
          min: 1
        },
        unique: "yearPrimaryQuarterConstraint",
      },
      startDay: {
        type: Sequelize.INTEGER,
        validate: {
          max: 31,
          min: 1
        }
      },
      year: {
        type:Sequelize.INTEGER,
        unique: "yearPrimaryQuarterConstraint",
      },

      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });

    const periodTuples = [[1,4],[2,2],[8,1],[8,2],[8,3],[8,4], [11,3]];
    const periodsToInsert = [];

    const arbitraryEndDay = 31;
    const arbitraryMonth = 1;
    const arbitraryStartDay = 24;
    const arbitraryYear = 2018;

    periodTuples.forEach((periodTuple) => {
      
      for(let weekday = 0; weekday < 14; weekday++){

        let isAM = true;
        if((weekday / 7) >= 1) {
          isAM = false;
        } else {
          isAM = true;
        }
        
        const periodInstance = {
          
          day: (weekday % 7) + 1,
          endDay: arbitraryEndDay,
          generation: 0,
          isAM: isAM,
          month: arbitraryMonth,
          primaryPeriod: periodTuple[0],
          quarterPeriod: periodTuple[1],
          startDay: arbitraryStartDay,
          year: arbitraryYear,

          createdAt: Sequelize.fn('now'),
        }

        periodsToInsert.push(periodInstance);
      }
    });
    
    await queryInterface.bulkInsert('periods', periodsToInsert
    //   [
    //     {
    //       month: 1,
    //       week: 4,
    //       currentWeekday: 0,
    //       createdAt: Sequelize.fn('now'),
    //       updatedAt: Sequelize.fn('now')
    //     },
    //     {
    //       month: 2,
    //       week: 2,
    //       currentWeekday: 0,
    //       createdAt: Sequelize.fn('now'),
    //       updatedAt: Sequelize.fn('now')
    //     },
    //     {
    //       month: 8,
    //       week: 2,
    //       currentWeekday: 0,
    //       createdAt: Sequelize.fn('now'),
    //       updatedAt: Sequelize.fn('now')
    //     },
    //     {
    //       month: 8,
    //       week: 3,
    //       currentWeekday: 0,
    //       createdAt: Sequelize.fn('now'),
    //       updatedAt: Sequelize.fn('now')
    //     }
    // ]
    );

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
      },
      unitOfMeasurement: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {model: 'categories', key: 'name'}
      },
      tag: {
        type: Sequelize.STRING,
        defaultValue: 'ect',
        allowNull: false
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

    await queryInterface.bulkInsert('items', [
      {
        name: "Chocolate",
        unitOfMeasurement: "Slice",
        category: "Desserts",
        tag: "Cheesecake",
        quantity: 4,
        price: 3.50,
        isActive: false,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
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
        name: "Vanilla",
        unitOfMeasurement: "Tub",
        category: "Desserts",
        tag: "Ice Cream",
        quantity: "10",
        price: 5.00,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
      {
        name: "Brioche Burger Buns",
        unitOfMeasurement: "Each",
        category: "Breads",
        tag: "Bread",
        quantity: 0,
        price: 0.47,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
      {
        name: "French",
        unitOfMeasurement: "Bag",
        category: "Breads",
        tag: "Bread",
        quantity: 0,
        price: 2.09,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
      {
        name: "Fruit",
        unitOfMeasurement: "Each",
        category: "Breads",
        tag: "Bread",
        quantity: 0,
        price: 13.42,
        isActive: false,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
      {
        name: "Fruit",
        unitOfMeasurement: "Slice",
        category: "Breads",
        tag: "Bread",
        quantity: 0,
        price: 0.48,
        isActive: false,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
      {
        name: "Yellow Corn",
        unitOfMeasurement: "Pack",
        category: "Breads",
        tag: "Tortilla",
        quantity: 0,
        price: 2.62,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
      {
        name: "Red Ribbon",
        unitOfMeasurement: "Kg.",
        category: "Breads",
        tag: "Tortilla",
        quantity: 0,
        price: 4.15,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
      {
        name: "Flat Bread",
        unitOfMeasurement: "Each",
        category: "Breads",
        tag: 'Etc.',
        quantity: 0,
        price: 0.77,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
      {
        name: "Butter - unsalted",
        unitOfMeasurement: "Each",
        category: "Dairy",
        tag: 'Etc.',
        quantity: 0,
        price: 3.99,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
      {
        name: "Aged Cheddar",
        unitOfMeasurement: "Kg.",
        category: "Dairy",
        tag: "Cheese",
        quantity: 0,
        price: 9.86,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
      {
        name: "Feta",
        unitOfMeasurement: "Tub",
        category: "Dairy",
        tag: "Cheese",
        quantity: 0,
        price: 109.18,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
      {
        name: "Goat",
        unitOfMeasurement: "Kg.",
        category: "Dairy",
        tag: "Cheese",
        quantity: 0,
        price: 15.23,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
      {
        name: "Hard Boiled",
        unitOfMeasurement: "Bag",
        category: "Dairy",
        tag: "Eggs",
        quantity: 0,
        price: 2.21,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
      {
        name: "Liquid Excelle",
        unitOfMeasurement: "Carton",
        category: "Dairy",
        tag: "Eggs",
        quantity: 0,
        price: 3.16,
        isActive: true,
        createdAt: Sequelize.fn('now'),
        updatedAt: Sequelize.fn('now')
      },
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
      isSubmitted: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
      },
      periodId: {
        type: Sequelize.INTEGER,
        references: {model: 'periods', key: 'id'}
      },
      // day: {
      //   type: Sequelize.INTEGER,
      //   validate: {
      //     min: 1,
      //     max: 7
      //   }
      // },
      // isAM: {
      //   type: Sequelize.BOOLEAN,
      //   allowNull: false
      // },
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
        // for(let weekday = 1; weekday <= 7; weekday++){
        //   const amPeriodItem = {};
        //   const pmPeriodItem = {};

        //   amPeriodItem.periodId = period.id;
        //   pmPeriodItem.periodId = period.id;
        //   amPeriodItem.itemId = item.id;
        //   pmPeriodItem.itemId = item.id;
        //   amPeriodItem.day = weekday;
        //   pmPeriodItem.day = weekday;
        //   amPeriodItem.quantity = item.quantity;
        //   pmPeriodItem.quantity = item.quantity;
        //   amPeriodItem.price = item.price;
        //   pmPeriodItem.price = item.price;
        //   amPeriodItem.isAM = true;
        //   pmPeriodItem.isAM = false;
        //   amPeriodItem.isSubmitted = false;
        //   pmPeriodItem.isSubmitted = false;
        //   amPeriodItem.createdAt = Sequelize.fn('now');
        //   pmPeriodItem.createdAt = Sequelize.fn('now');

        //   periodItemsToAdd.push(amPeriodItem);
        //   periodItemsToAdd.push(pmPeriodItem);
        // }

        const itemInstance = {};

        itemInstance.itemId = item.id;
        itemInstance.periodId = period.id;
        itemInstance.quantity = item.quantity;
        itemInstance.price = item.price;
        itemInstance.isSubmitted = false;
        itemInstance.createdAt = Sequelize.fn('now')

        periodItemsToAdd.push(itemInstance);
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
