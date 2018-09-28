const Item = require('../models').Item;
const Period = require('../models').Period;
const PeriodItem = require('../models').PeriodItem;

module.exports = {

	async add(req, res) {
		const itemPromise = await Item
			.create({
				category: req.body.category,
				isActive: req.body.isActive,
				name: req.body.name,
				price: req.body.price,
				quantity: req.body.quantity,
				tag: req.body.tag,
				unitOfMeasurement: req.body.unitOfMeasurement,
			}, {returning: true})
			.catch((error) => res.status(400).send(error));

		if(req.body.periodToUpdate !== null || req.body.periodToUpdate !== undefined) {
			let period = await Period
				.findById(req.body.periodToUpdate.id)
				.catch((error) => res.status(400).send(error));

			if(!period) res.status(404).send({message: "Period Not Found"});

			const item = itemPromise;

			const periodItemsToAdd = [];

			let weekday = period.currentWeekday;
			if(period.currentWeekday === 0) weekday = 1;

			for(weekday; weekday <= 7; weekday++) {
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

	            periodItemsToAdd.push(amPeriodItem);
          		periodItemsToAdd.push(pmPeriodItem);
			}

			const periodItemCallback = await PeriodItem.bulkCreate(periodItemsToAdd, {returning: true})
				.catch((error) => res.status(400).send(error));

			const newItemAndInstances = {
				item: item,
				periodItems: periodItemCallback
			}

			res.status(201).send(newItemAndInstances);
		}

		res.status(201).send(itemPromise);

			
	},

	delete(req, res) {
		return Item
			.findById(req.params.id, {})
			.then((item) => {
				if(!item) {
					return res.status(404).send({
						message: 'Item not found for deletion'
					});
				}
				return item
					.destroy()
					.then(() => res.status(204).send())
					.catch((error) => res.status(400).send(error));
			})
			.catch((error) => res.status(400).send(error));
	},

	getById(req, res) {
		return Item
			.findById(req.params.id, {})
			.then((item) => {
				if(!item) {
					return res.status(404).send({
						message: 'Item Not Found'
					});
				}
				return res.status(200).send(item);
			})
			.catch((error) => res.status(400).send(error));
	},

	list(req, res) {
		return Item
			.findAll({})
			.then((items) => res.status(200).send(items))
			.catch((error) => res.status(400).send(error));
	},

	updateItem(req, res) {
		return Item
			.findById(req.body.id, {})
			.then((item) => {
				if(!item) {
					return res.status(404).send({
						message: 'Item Not Found'
					});
				}

				return item
					.update(req.body.fieldsToUpdate, {returning: true})
					.then((result) => res.status(200).send(result))
					.catch((error) => res.status(400).send({
							message: "Failed during update."
					}));
			})
			.catch((error) => res.status(400).send({
				message: "Failure on outer scope."
			}));
	},


}