// 'use strict';

// var fs        = require('fs');
// var path      = require('path');
// var Sequelize = require('sequelize');
// var basename  = path.basename(__filename);
// var env       = process.env.NODE_ENV || 'development';
// var config    = require(__dirname + '/../config/config.js')[env];
// var db        = {};

// console.log("USE ENV VARIABLE?: " + config.use_env_variable);

// if (config.use_env_variable) {
//   var sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   var sequelize = new Sequelize(config.database, config.username, config.password, config);
 

//   // const sequelize = new Sequelize(
//   //   process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
//   //   dialect: 'postgres'
//   // });
//   // sequelize.authenticate()
//   // .then(() => {
//   //   console.log("Connected to Postgres");
//   // })
//   // .catch((err) => {
//   //   console.log('Unable to connect to database:');
//   //     console.log(err);
//   // });
// }


// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (file.indexOf('.') !== 0) && (file !== 'sequelize.js') && (file !== basename) && (file.slice(-3) === '.js');
//   })
//   .forEach(file => {
//     var model = sequelize['import'](path.join(__dirname, file));
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;

//sequelize.js

const Sequelize = require('sequelize');

const CategoryModel = require('./category.js');
const ItemModel = require('./item.js');
const PeriodModel = require('./period.js');
const PeriodItemModel = require('./periodItem.js');

const sequelize = new Sequelize(
  process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  dialect: 'postgres'
});

const postgresPromise = sequelize.authenticate()
.then(() => {
  console.log("Connected to Postgres");
})
.catch((err) => {
  console.log('Unable to connect to database:');
    console.log(err);
});

const Category = CategoryModel(sequelize, Sequelize);
const Item = ItemModel(sequelize, Sequelize);
const Period = PeriodModel(sequelize, Sequelize);
const PeriodItem = PeriodItemModel(sequelize, Sequelize);

module.exports = {
  Category,
  Item,
  Period,
  PeriodItem,
  sequelize
}