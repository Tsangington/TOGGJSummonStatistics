const { scrapeSummons, scrapeSummons2 } = require('./scrapeSummons');
const json = require('JSON')
const statistics = require("./summonStatistics.js")

async function parseData(url) {

	summonData = await scrapeSummons2(url);
	parsedSummonData = []
	summonData = json.parse(summonData)
	summonHistory = summonData.props.pageProps.histories

	for (let index=0; index<summonHistory.length; index++) {

		parsedSummonData.push( [summonHistory[index]["itemName"], summonHistory[index]["gachaName"]])
	}

	return parsedSummonData
};

async function getSummonObject(url) {
	var parsedSummonData = await parseData(url)
	var summonStatistics = new statistics.SummonStatistics(parsedSummonData)

	return summonStatistics.getSummonObject()
}

module.exports = {
	parseData,
	getSummonObject
}
