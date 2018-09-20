const Category = require('../models').Category;
// const bodyParser = require('body-parser');

module.exports = {
	
	add(req, res) {
		return Category
			.create({
				name: req.body.name
			})
			.then((category) => res.status(201).send(category))
			.catch((error) => res.status(400).send(error));
	},

	delete(req, res) {
		return Category
			.findById(req.params.name, {})
			.then((category) => {
				if(!category) {
					return res.status(404).send({
						message: 'Category Not Found'
					});
				}
				return category
					.destroy()
					.then(() => res.status(204).send())
					.catch((error) => res.status(400).send(error))
			})
			.catch((error) => res.status(400).send(error));
	},

	getByName(req, res) {
		return Category
			.findById(req.params.name, {
				// include: [{
				// 	model: Category,
				// 	as: 'category'
				// }],
			})
			.then((category) => {
				if(!category) {
					return res.status(404).send({
						message: 'Category Not Found'
					});
				}
				return res.status(200).send(category);
			})
			.catch((error) => res.status(400).send(error));
	},

	insertTag(req, res) {
		return Category
			.findById(req.params.name, {})
			.then((category) => {
				if(!category) {
					return res.status(404).send({
						message: "Category Not Found"
					});
				}

				const tagAlreadyExists = category.tags.includes(req.body.tag);
				if(tagAlreadyExists) return res.status(400).send({
					message: "Tag Already Exists"
				})

				category.tags.push(req.body.tag);

				return category
					.update({
						tags: category.tags
					})
					.then(() => res.status(200).send(category))
					.catch((error) => res.status(400).send(error));
			})
			.catch((error) => res.status(400).send(error));
	},

	list(req, res) {
		return Category
			.findAll({}) //maybe sort here with 'order'
			.then((categories) => res.status(200).send(categories))
			.catch((error) => res.status(400).send(error));
	},

	
};