const { scrapeSummons} = require('./scrapeSummons');
const json = require('JSON')
const statistics = require("./summonStatistics.js")

async function parseData(url) {
	/* 
    Takes the URL, then uses the subsequent JSON object to create
	a smaller object for quicker data sorting later on
    
    Parameters: 
     - URL: string - To find the correct summon history to read from
    
    Returns:
     - parsedSummonData: array - a 2D array to be used later on
    */
	summonData = await scrapeSummons(url);
	parsedSummonData = []
	summonData = json.parse(summonData)
	summonHistory = summonData.props.pageProps.histories

	for (let index=0; index<summonHistory.length; index++) {

		parsedSummonData.push( [summonHistory[index]["itemName"], summonHistory[index]["gachaName"]])
	}

	return parsedSummonData
};

async function getSummonObject(url) {
	/* 
    Takes the URL, gets the parsedSummonData array and creates the
	SummonObject that will be passed to the frontend
    
    Parameters: 
     - URL: string - To find the correct summon history to read from
    
    Returns:
     - SummonObject : Object - Object with all the summonTypes and statistics
	 to be shown in the front-end
    */
	var parsedSummonData = await parseData(url)
	var summonStatistics = new statistics.SummonStatistics(parsedSummonData)

	return summonStatistics.getSummonObject()
}

module.exports = {
	parseData,
	getSummonObject
}
