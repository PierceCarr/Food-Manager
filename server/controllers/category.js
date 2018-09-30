const Category = require('../models').Category;
// const bodyParser = require('body-parser');

module.exports = {
	
	add(req, res) {
		let tags = ["Etc."];
		if(req.body.tags !== undefined) tags = req.body.tags; 
		return Category
			.create({
				name: req.body.name,
				tags: tags,
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
						message: 'Category not found for deletion'
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
			.findById(req.body.categoryName, {})
			.then((category) => {
				if(!category) {
					return res.status(404).send({
						statusText: "Category not found for tag insertion"
					});
				}

				const tagAlreadyExists = category.tags.includes(req.body.tagName);
				if(tagAlreadyExists) return res.status(400).send({
					statusText: "Tag Already Exists"
				});

				category.tags.push(req.body.tagName);

				let tagSortArray = [];
				category.tags.forEach((tag) => {
          			if(tag !== "Etc.") tagSortArray.push(tag);
        		});

        		tagSortArray = tagSortArray
		          .sort((a, b) => {
		            if (a > b) return 1;
		            if (a < b) return -1;
		            return 0;
		          });

       			 tagSortArray.push("Etc.");

       			 // category.tags = tagSortArray;

				return category
					.update({
						tags: tagSortArray
					})
					.then(() => res.status(200).send(category))
					.catch((error) => res.status(400).send({
						statusText: "Failed during category update of tag insertion"
					}));
			})
			.catch((error) => res.status(400).send({
				statusText: "Failed on outer scope of tag insertion"
			}));
	},

	list(req, res) {
		return Category
			.findAll({order: [['name']]}) 
			.then((categories) => res.status(200).send(categories))
			.catch((error) => res.status(400).send(error));
	},

	
};