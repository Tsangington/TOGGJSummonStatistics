const { scrapeSummons } = require('./scrapeSummons');

(async function parseData() {
	const url = 'https://global-tog-info.ngelgames.com/history/MTAyMzIxNjk=';
	const summonData = await scrapeSummons(url);

	console.log(summonData)
})();