const schedule = require('node-schedule');
const newsCtrl = require('../controller/newsCtrl');
const moment = require('moment');

schedule.scheduleJob('*/10 * * * *', async function(){
	console.time("news");
	console.log("news cron start", moment().format("HH:mm:ss"));
	await newsCtrl.crawling();
	console.timeEnd('news');
})