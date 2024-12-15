const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const getOffsetAndLimit = require('../lib/getOffsetAndLimit');
const { Op } = require('sequelize');

const getHtml = async (url) => {
	const { data } = await axios.get(url);
	return data;

}

const crawling = async () => {
	const URL = 'https://www.yna.co.kr/sports/all';
	const html = await getHtml(URL);
	const $ = cheerio.load(html);

	const bodyList = $('.section01 .list .item-box01');
	// console.log(bodyList[0]);
	const result = []
	const pattern = /.+view\/([^\?]+)/
	bodyList.each((i, el) => {
		const title = $(el).find('.tit-news').text();
		const content = $(el).find('.lead').text();
		const time = moment().format('YYYY-') + $(el).find('.txt-time').text() + ":00";
		const img = $(el).find('.img-con img').attr('src');
		const url = $(el).find('.tit-wrap').attr('href');
		const matches = pattern.exec(url);
		const id = matches[1];

		result.push({ id, title, content, img, url, time });
	})

	const rows = await $DB.news.bulkCreate(result, {
		updateOnDuplicate: ['id', 'title', 'content', 'img',]
	})

	return rows;
}

/*
page
rowsPerPage
sortBy
decending
search // 검색
*/
const list = async (query) => {
	//console.log(query);
	const page = query.page ? parseInt(query.page, 10) : 1;
	const rowsPerPage = query.rowsPerPage ? parseInt(query.rowsPerPage, 10) : 10;
	const sortBy = query.sortBy || 'time';
	const decending = query.decending ? query.decending == 'true' : false;
	const search = query.search || "";

	const where = {}
	if (search) {
		where[Op.or] = [
			{ title: { [Op.like]: `%${search}%` } },
			{ content: { [Op.like]: `%${search}%` } }
		]
	}

	const result = await $DB.news.findAndCountAll({
		where,
		...getOffsetAndLimit(page, rowsPerPage),
		order: [
			[sortBy, decending ? 'DESC' : 'ASC']
		]
	})
	return result;
}

module.exports = {
	crawling, list
}