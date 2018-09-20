const PeriodItem = require('../models').PeriodItem;

module.exports = {
	listForPeriod(req, res) {
		return PeriodItem
			.findAll({
				where: {
					periodId: req.params.periodId
				}
			})
			.then((items) => res.status(200).send(items))
			.catch((error) => res.status(400).send(error));
	}
}