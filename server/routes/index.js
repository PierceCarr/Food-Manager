var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

//For local use:
const sequelize = new Sequelize(
	process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  dialect: 'postgres'
});

sequelize.authenticate().then(() => {
  console.log("Connected to Postgres");
}).catch((err) => {
	console.log('Unable to connect to database:');
  console.log(err);
});

const Item = sequelize.define('item', {
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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
