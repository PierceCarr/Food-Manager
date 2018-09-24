const Period = require('../models').Period;

module.exports = {
	list(req, res) {
		return Period
			.findAll({})
			.then((periods) => res.status(200).send(periods))
			.catch((error) => res.status(400).send(error));
	}
}