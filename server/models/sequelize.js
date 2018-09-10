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