const axios = require('axios');
const Period = require('../models').Period;

const getLatestPeriod = (currentDate) => {
	//Query current year/month

	const didPeriodStartInPreviousMonth = currentDate.day <= 7;

	const JANUARY = 1;
	const yearsToQuery = [currentDate.year];
	if(currentDate.month === JANUARY && didPeriodStartInPreviousMonth) {
		yearsToQuery.push(currentDate.year--);
	}

	let monthsToQuery = [currentDate.month];
	if(didPeriodStartInPreviousMonth) {
		monthsToQuery.push(currentDate.month--);
	}
}

//First period is the period that contains November 1st
const isFirstPeriod = (period) => {
	let isFirstPeriod = false;

	const NOVEMBER = 11;
	const OCTOBER = 10;
	if(period.month === NOVEMBER && period.endDay === 7) {
		isFirstPeriod = true;
	} else if (period.month === OCTOBER && period.startDay >= 25) {
		isFirstPeriod = true;
	}

	return isFirstPeriod;
}

module.exports = {
	list(req, res) {
		return Period
			.findAll({})
			.then((periods) => res.status(200).send(periods))
			.catch((error) => res.status(400).send(error));
	},

	async checkUpToDate(req, res) {
		const checkDatePromise = await axios({
			method: 'get',
			url: 'http://api.timezonedb.com/v2.1/get-time-zone?key=F5VB1ZB4EC6C&format=json&by=zone&zone=America/Vancouver',
			headers: {
			  'Content-Type': 'application/json'
			},
		})
		.catch((err) => {
			console.log('Unable to connect to check date:');
		  	console.log(err);
		});

		console.log("CURRENT DATE: " + checkDatePromise.data.formatted);
		console.log("DATE DATA: " + JSON.stringify(checkDatePromise.data));

		const dateString = JSON.stringify(checkDatePromise.data.formatted);
		const currentYear = Number(dateString.slice(1,5));
		const currentMonth = Number(dateString.slice(6,8));
		const currentDay = Number(dateString.slice(9,11));

		const currentDate = {};
		currentDate.year = currentYear;
		currentDate.month = currentMonth;
		currentDate.day = currentDay;

		console.log("DAY: " + currentDay + ", MONTH: " + currentMonth + ", YEAR: " + currentYear);

		res.status(200).send({message: "Updated periods"});
	}
}