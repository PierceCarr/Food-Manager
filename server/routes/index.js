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
		unique: 'nameUnitIndex'
	},
	unitOfMeasure: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: 'nameUnitIndex'
	},
	category: {
		type: Sequelize.STRING,
		allowNull: false
	},
	tag: {
		type: Sequelize.STRING,
		allowNull: true,
		defaultValue: null
	}
	price: {
		type: Sequelize.FLOAT,
		defaultValue: 0
	},
	qty: {
		type: Sequelize.FLOAT,
		defaultValue: 0,
	},
	isActive: {
		type: Sequelize.BOOLEAN,
		defaultValue: true
	}
});

const Category = sequelize.define('category', {
	name: {
		type: Sequelize.String,
		allowNull: false,
		unique: true
	},
	tags: {
		type: Sequelize.ARRAY(Sequelize.STRING),
		unique: true
	}
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
