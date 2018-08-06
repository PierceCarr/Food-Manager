var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

router.use(bodyParser.json());

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

const Category = sequelize.define('categories', {
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
	}
});

const Item = sequelize.define('items', {
	name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: "nameUnitConstraint",
        // primaryKey: true
      },
      unitOfMeasure: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: "nameUnitConstraint"
        // primaryKey: true
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
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      }
});

/* GET home page. */
router.route('/')
.get((req, res, next) => {
	res.statusCode = 200;
	res.json({message: "Transmission recieved loud and clear m80 p0t80"});
})
.post((req, res, next) => {
	if(req.body.isReceive === true){
		res.statusCode = 200;
		console.log('Recieved the recieve');
		if(req.body.isItemInputterMounting === true){
				Category.findAll().then((results) => {
					res.json(results);
				})
			}

	} else { //Inserting a record
		if(res.body.newCategory === true){
			//Insert new category

		} 
		//Insert new item here
		res.statusCode = 201;
		Item.sync().then(() => {
			return Item.create ({
				name: req.body.name,
				unitOfMeasure: req.body.unitOfMeasure,
				category: req.body.category,
				tag: req.body.tag,
				quantity: req.body.quantity,
				price: req.body.price,
				isActive: req.body.isActive
			})
		})
	}
})
.patch((req, res, next) => {
	res.statusCode = 200;
	res.json({message: "Rodger, making the change."});
})
.delete((req, res, next) => {
	res.statusCode = 200;
  	res.json({message: "Right, deleting."});
});

module.exports = router;
