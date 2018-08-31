var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const currencyFormatter = require('currency-formatter');


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

const Category = sequelize.import("../models/category.js");
const Item = sequelize.import("../models/item.js");
const Period = sequelize.import("../models/period.js");
const PeriodItem = sequelize.import("../models/periodItem.js");


//ROUTES
router.route('/')
.get((req, res, next) => {
	res.statusCode = 200;
	res.json({message: "Transmission recieved loud and clear m80 p0t80"});
})
.post((req, res, next) => {
	if(req.body.isReceive){
		res.statusCode = 200;

		if(req.body.isReceivingCategoriesPeriodsAndItems){
			const categoriesPeriodsAndItems = {};
			const categories = [];
			const items = [];
			const periods = [];

			const categoryPromise = Category.findAll({}, {raw: true})
			.then((results) => results.forEach((result) => {
				categories.push(result);
			}))
			.then(() => {
				categoriesPeriodsAndItems.categories = categories;
			});

			const itemPromise = Item.findAll({}, {raw: true})
			.then((results) => results.forEach((result) => {
				items.push(result);
			}))
			.then(() => {
				categoriesPeriodsAndItems.items = items;
			})

			const periodPromise = Period.findAll({}, {raw: true})
			.then((results) => results.forEach((result) => {
				periods.push(result);
			}))
			.then(() => {
				categoriesPeriodsAndItems.periods = periods;
			});

			Promise.all([categoryPromise, itemPromise, periodPromise])
			.then(() => res.json(categoriesPeriodsAndItems));

		} else if (req.body.isReceivingPeriodItems) {

			PeriodItem.findAll({
				where: {
					day: req.body.day,
					isAM: req.body.isAM,
					periodId: req.body.periodId
				}
			})
			.then((results) => res.json(results));
		}

	} else { //Inserting a record
		console.log("In else");
		if(req.body.newCategory === true) {
			//Insert new category
			console.log("In new category insertion");
		} 
		//Insert new item here
		console.log("Inserting item");
		res.statusCode = 201;
		Item.sync().then(() => {
			return Item.create ({
				name: req.body.name,
				unitOfMeasurement: req.body.unitOfMeasurement,
				category: req.body.category,
				tag: req.body.tag,
				quantity: req.body.quantity,
				price: req.body.price,
				isActive: req.body.isActive
			})
		})
		res.json();
	}
})
.patch((req, res, next) => {
	
	if(req.body.isUpdateSinglePeriodItem === true) {
		
		console.log("Request to update: " + req.body.originalItem.id);
		console.log("Properties to update: " + JSON.stringify(req.body.propertiesToUpdate));

		if(req.body.propertiesToUpdate.price !== undefined){
			let price = req.body.propertiesToUpdate.price;
			price = currencyFormatter.format(price, {code: 'USD'});
			price = currencyFormatter.unformat(price, {code: 'USD'});
			req.body.propertiesToUpdate.price = price;
			console.log("Price to update: " + price);
		}

		console.log("About to update");
		PeriodItem.update(req.body.propertiesToUpdate,{
			returning: true,
			where: {
				id: req.body.originalItem.id,
			}
		}).then(([rowsUpdate, [updatedItem]]) => {
			console.log("Sending back results");
			res.statusCode = 200;
			res.json(updatedItem);
		})
		.catch(next);

	} else {
		res.statusCode = 404;
		res.json("Got a bad patch request");
	}
})
.delete((req, res, next) => {
	res.statusCode = 200;
  	res.json({message: "Right, deleting."});
});

module.exports = router;