const { scrapeSummons } = require('./scrapeSummons');

(async function parseData() {
	const url = 'https://global-tog-info.ngelgames.com/history/MTAyMzIxNjk=';
	const summonData = await scrapeSummons(url);

	var redSummonData = [];
	var blueSummonData = [];
	var destinySummonData = [];

	totalSummons = summonData.length
	for (var index=0; index < summonData.length; index++) {
		
		summonType = summonData[index][2]
		if (summonType === "The One Who Opens The Tower's Door"){
			
			blueSummonData.push(summonData[index])

		} else if (summonType.startsWith("Destiny Summon") === true){
			
			destinySummonData.push(summonData[index])
		
		} else {
			
			redSummonData.push(summonData[index])
		}
	}

	
	
	
	
	
	
	var redSummonTotal = redSummonData.length
	var blueSummonTotal = blueSummonData.length
	var destinySummonTotal = destinySummonData.length

	console.log("Total summons: " + totalSummons)
	console.log("Red Summon total: " + redSummonTotal)
	console.log(redSummonData)
	console.log("Blue summon total: " + blueSummonTotal)
	console.log("Destiny summon total: " + destinySummonTotal)

})();