'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('categories', [
      {
        name: "Meats",
        tags: ["Back Ribs", "Bacon", "Burgers", "Carapacchio", "Chicken"]
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
        name: "Breads",
        tags: ["Bread", "Torts"]
      },
      {
        name: "Dairy",
        tags: ["Cheese", "Eggs", "Butter"]
      }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('categories', null, {});
  }
};
