const Item = require('../models').Item;
const Period = require('../models').Period;
const PeriodItem = require('../models').PeriodItem;

module.exports = {

	// listPeriodItemsForPeriod(req, res) {
	// 	console.log("It's what you think");
	// 	return PeriodItem
	// 		.findAll({
	// 			where: {
	// 				periodId: req.params.periodId
	// 			}
	// 		})
	// 		.then((items) => res.status(200).send(items))
	// 		.catch((error) => res.status(400).send(error));
	// },

	listForWasteForm(req, res) {
		console.log("PARAMS: " + req.params);
		return PeriodItem
			.findAll({
				where: {
					day: req.params.day,
					isAM: req.params.isAM,
					periodId: req.params.periodId,
				}
			})
			.then((items) => res.status(200).send(items))
			.catch((error) => res.status(400).send(error));
	},

	async createOustandingPeriodItems(req, res) {
		console.log("CREATING OUTSTANDING PERIOD ITEMS");
		let period = await Period
			.findAll({
				where: {
					id: req.body.id
				}
			})
			.catch((error) => res.status(400).send(error));

		if(!period) res.status(404).send({message: "Period Not Found"});
		console.log("RETURNED FROM QUERY: " + JSON.stringify(period));

		period = period[0];

		console.log("WORKING WITH PERIOD: " + JSON.stringify(period));

		const itemList = await Item.findAll({})
			.catch((error) => res.status(400).send(error));
		
		const currentPeriodItemList = await PeriodItem
			.findAll({
				where: {
					periodId: req.body.id
				}
			})
			.catch((error) => res.status(400).send(error));

		const periodItemsToAdd = [];

		itemList.forEach((item) => {
			let isAlreadyGenerated = false;

			if(currentPeriodItemList.length > 0) {
				currentPeriodItemList.forEach((periodItem) => {
					if(periodItem.itemId === item.id) {
						isAlreadyGenerated = true;
					}
				});
			}

			if(isAlreadyGenerated === false && item.isActive === true){
				let weekday = period.currentWeekday;
				if(period.currentWeekday === 0) weekday = 1;

				for(weekday; weekday <= 7; weekday++){
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
			}
		})

		const addEm = await PeriodItem.bulkCreate(periodItemsToAdd, {returning: true})
			.then((newPeriodItems) => res.status(200).send(newPeriodItems))
			.catch((error) => res.status(400).send(error));
	},

	update(req, res) {
		return PeriodItem.findAll({
			where: {
				id: req.body.id
			}
		})
		.then((periodItem) => {
			if(!periodItem) res.status(404).send({message: "PeriodItem Not Found"});
			var periodItem = periodItem[0];
			let propertyUpdates = {};
			const legalProperties = ["isSubmitted", "price", "quantity"];

			req.body.propertiesToUpdate.forEach((propertyTuple) => {
				if(legalProperties.includes(propertyTuple[0])) {
					const objectWithNewProperty = {[propertyTuple[0]]: propertyTuple[1]};
					propertyUpdates = Object.assign(objectWithNewProperty, propertyUpdates);
				}
			})
			return periodItem
 				.update(propertyUpdates)
				.then(() => res.status(200).send(periodItem))
				.catch((error) => res.status(400).send(error));
		})
		.catch((error) => res.status(400).send(error));
	},


}