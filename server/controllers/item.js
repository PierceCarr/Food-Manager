const Item = require('../models').Item;
const PeriodItem = require('../models').PeriodItem;

//ADD SHOULD CREATE PERIOD ITEMS WHEN HANDED A POSITIVE FLAG

module.exports = {

	async add(req, res) {
		const itemPromise = await Item
			.create({
				category: req.body.category,
				isActive: req.body.isActive,
				name: req.body.name,
				// periodToUpdate: req.body.periodToUpdate,
				price: req.body.price,
				quantity: req.body.quantity,
				tag: req.body.tag,
				unitOfMeasurement: req.body.unitOfMeasurement,
			}, {returning: true})
			.catch((error) => res.status(400).send(error));


		res.status(201).send(itemPromise);

			
	},

	delete(req, res) {
		return Item
			.findById(req.params.id, {})
			.then((item) => {
				if(!item) {
					return res.status(404).send({
						message: 'Item Not Found'
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
		console.log("SEARCHING ID: " + req.body.id);
		return Item
			.findById(req.body.id, {})
			.then((item) => {
				if(!item) {
					return res.status(404).send({
						message: 'Item Not Found'
					});
				}

				return item
					.update({
						name: req.body.name,
						unitOfMeasurement: req.body.unitOfMeasurement,
						category: req.body.category,
						tag: req.body.tag,
						price: req.body.price,
						quantity: req.body.quantity,
						isActive: req.body.isActive
					})
					.then(() => res.status(200).send(item))
					.catch((error) => res.status(400).send(error));
			})
			.catch((error) => res.status(400).send(error));
	},


}