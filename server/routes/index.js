// var babel = require("babel-core");
// import React from 'react';
// import {Button} from "@blueprintjs/core";
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
		if(req.body.isReceivingCategoriesAndPeriods){
			const categoriesAndPeriods = {};
			const categories = [];
			const periods = [];

			const categoryPromise = Category.findAll({}, {raw: true})
			.then((results) => results.forEach((result) => {
				categories.push(result);
			}))
			.then(() => {
				categoriesAndPeriods.categories = categories;
			});

			const periodPromise = Period.findAll({}, {raw: true})
			.then((results) => results.forEach((result) => {
				periods.push(result);
			}))
			.then(() => {
				categoriesAndPeriods.periods = periods;
			});

			Promise.all([categoryPromise, periodPromise])
			.then(() => res.json(categoriesAndPeriods));

		} else if(req.body.isRecievingPeriodItems) {
			// PeriodItem.findAll({
			// 	where: {
			// 		day: req.body.day
			// 	}
			// })
		}

	} else { //Inserting a record
		console.log("In else");
		if(req.body.newCategory === true){
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
	res.statusCode = 200;
	res.json({message: "Rodger, making the change."});
})
.delete((req, res, next) => {
	res.statusCode = 200;
  	res.json({message: "Right, deleting."});
});

module.exports = router;