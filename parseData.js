const { scrapeSummons, scrapeSummons2 } = require('./scrapeSummons');
const json = require('JSON')

async function parseData(url) {

	summonData = await scrapeSummons2(url);
	totalSummonData = []
	summonData = json.parse(summonData)
	summonHistory = summonData.props.pageProps.histories

	for (let index=0; index<summonHistory.length; index++) {

		totalSummonData.push( [summonHistory[index]["itemName"], summonHistory[index]["gachaName"]])
	}

	[ancientData, redData, blueData, destinyData] = splitSummonTypes(totalSummonData)

	var total = new SummonList(summonData = redData.concat(blueData, destinyData), summonType = "Total");
	var ancient = new SummonList(summonData = ancientData, summonType = "Ancient")
	var red = new EventSummonList(summonData = redData, summonType = "Red");
	var blue = new SummonList(summonData = blueData, summonType = "Blue");
	var destiny = new SummonList(summonData = destinyData, summonType = "Destiny");

	var summonArray = [total, ancient, red, blue, destiny]
	var summonStatistics = {}

	for (let index = 0; index < summonArray.length; index++) {
		summonType = summonArray[index].summonType

		//create dictionary for each type of summons
		summonStatistics[summonType] = {}

		summonTypeObject = summonStatistics[summonType]
		summonTypeObject["totalSummons"] = summonArray[index].summonTotal

		//Adding specific ancient banner data
		if (summonType === "Ancient") {
			summonTypeObject["totalAncients"] = ancient.numberAncient
			summonTypeObject["averageAncientPity"] = ancient.averageAncientPity
		}

		summonTypeObject["totalLegendaries"] = summonArray[index].numberLegendary
		summonTypeObject["averageLegendaryPity"] = summonArray[index].averageLegendaryPity

		//Adding specific red banner data
		if (summonType === "Red") {
			summonTypeObject["fiftiesWon"] = red.totalFiftiesWon
			summonTypeObject["fiftiesLost"] = red.totalFiftiesLost
			summonTypeObject["fiftiesWonPercent"] = red.totalFiftiesWonPercent
		}

		summonTypeObject["totalEpics"] = summonArray[index].numberEpic
		summonTypeObject["averageEpicPity"] = summonArray[index].averageEpicPity
	}
	summonStatistics["Red"]["separateEventStatistics"] = red.separateEventStatistics

	return (summonStatistics)
};

function splitSummonTypes(totalSummonData) {

	var ancientData = [];
	var redData = [];
	var blueData = [];
	var destinyData = [];

	totalSummons = totalSummonData.length
	ancientBanners = ["The Aloof Wave of the Tower", "Poe Bidau Gustang's Exclusive Ignition Weapon."]

	for (let index = 0; index < totalSummons; index++) {
		summonType = totalSummonData[index][1]
		if (ancientBanners.includes(summonType) === true) {

			ancientData.push(totalSummonData[index])

		}
		else if (summonType === "The One Who Opens The Tower's Door") { //|| summonType === "Selective Summon"

			blueData.push(totalSummonData[index])

		} else if (summonType.startsWith("Destiny Summon") === true) {

			destinyData.push(totalSummonData[index])

		} else if (summonType.startsWith("Selective Summon") === true) {
			continue
		}
		else {

			redData.push(totalSummonData[index])
		}
	}
	return ([ancientData, redData, blueData, destinyData])
}

class SummonList {
	constructor(summonData, summonType) {
		this.summonData = summonData
		this.summonTotal = summonData.length
		this.summonType = summonType

		var [allAncientsData,
			allLegendariesData,
			allEpicsData] = this.sortRarities(summonData)

		this.allLegendariesData = allLegendariesData

		this.numberAncient = allAncientsData.length
		this.numberLegendary = allLegendariesData.length
		this.numberEpic = allEpicsData.length

		this.averageAncientPity = this.averagePity(this.summonTotal, this.numberAncient)
		this.averageLegendaryPity = this.averagePity(this.summonTotal, this.numberLegendary)
		this.averageEpicPity = this.averagePity(this.summonTotal, this.numberEpic)
	}
	sortRarities(summonData) {
		/*Have 4* and 5* characters and weapon names listed here */
		var rarityDictionary =
		{
			"ancient":
				[
					"Poe Bidau Gustang",

					"Ancient Book of Origin"
				],
			"legendary":
				[
					"Data Khun Edahn",
					"Data Urek Mazino",
					"Hockney",
					"Evankhell",
					"Rachel Swallowed the Darkness",
					"Elaine",
					"Khun Maschenny Jahad",
					"Midnight Aurora Rachel",
					"Emerald Ocean Yihwa Yeon",
					"Summer Splash Endorsi",
					"Bam",
					"Viole",
					"First Thorn Bam",
					"Blue Thryssa Bam",
					"Green April Anaak",
					"Khun Ran",
					"Yihwa Yeon",
					"White Heavenly Mirror Khun",
					"Sachi Faker",
					"Verdi",
					"Enryu",
					"Yuri Ha",
					"Hunter Rak",
					"White",
					"Hansung Yu",
					"Hwaryun",
					"Daniel Hatchid",
					"Xiaxia",
					"Urek Mazino",
					"Reflejo",
					"Beta",
					"Cassano",
					"Evan",
					"Yura Ha",
					"Waterbomb Commander Xiaxia",
					"Albelda",
					"White Candy Khun",
					"Bong Bong Endorsi",
					"Karaka",
					"Jinsung Ha",
					"Kranos Yuri Ha",
					"Donghae Hatz",

					"Glitch Core",
					"Lightning of the Giant",
					"Lamplight of Leader",
					"Ancient Flare",
					"Invisible Inventory",
					"The Three Horns",
					"Jellyfish Parasol",
					"Sparkling Beach Floppy Hat",
					"Aqua Bong Bong",
					"Blue Rune Angelic Spear",
					"Guardian Bow",
					"Jahad Laevateinn",
					"FUG Wand",
					"Shinsu's Orb",
					"Unleased Donghae",
					"Cosmic Pure Octopus",
					"Black Rabbit Water Gun",
					"Top Star's MIC",
					"Cassano's Left Arm",
					"Fist of the Dragon and Tiger",
					"Living Ignition Weapon_Proto Type",
					"Bong Bong",
					"Blue Lightning Nucleus",
					"Red Rain",
					"Magical Candy Cane",
					"Crimson Rose",
					"Necromance",
					"Kranos",
					"Cullinan, Shinsu Sword",
					"Unleashed Thorn",
					"Sword of Revengeful Souls",
					"Iron Armor's Red Heart",
					"Dark Shinsu's Reaper",
					"Frog Fisher",
					"Mazino Wing Tree",
					"Black Rabbit Bomb",
					"Red Twin Blades",
					"Hairprin of Shinsu Control",
					"Thorn",
					"Mad Shocker",
					"Exploding Knuckle Blade",
					"White Heavenly Mirror",
					"Hairpin of Noble Power",
					"Black March",
					"Green April (Transformed)"
				],
			"epic":
				[
					"Alphine",
					"Endorsi",
					"Hatz",
					"Horyang",
					"Miseng",
					"Khun A. A.",
					"Lo Po Bia Ren",
					"Hoaqin",
					"Rachel",
					"Wangnan Ja",
					"Laure",
					"Love",
					"Novick",
					"Quaint Blitz",
					"Shibisu",
					"Varagav",
					"Mini Rak",
					"Boro",

					"Crown Bow",
					"Dark Chaser Book",
					"Angelic Blade",
					"Attract Blade",
					"Pink Kukri",
					"Rassen Kunai",
					"Super Lethal King Of Majesty Observer",
					"Quick Gloves",
					"Twin Circle Boomerang",
					"Antimatter Bomb",
					"Blue Gloves",
					"Rabbit Doll",
					"Ignition Gauntlet",
					"Cozy Blanket",
					"Yellow Lighthouse",
					"Ren's Flail",
					"Suspicious Messenger Bag",
					"Shinsu Gauntlet",
					"Donghae",
					"Redeye Needle"
				]
		};

		var allAncients = [];
		var allLegendaries = [];
		var allEpics = [];

		for (let index = 0; index < summonData.length; index++) {
			// Check whether a 2D array is passed in or just an array
			if (typeof summonData[0] === "object") {
				var summonName = summonData[index][0]
			}
			else {
				var summonName = summonData[index]
			}

			// Character and weapon Sorting
			if (rarityDictionary.ancient.includes(summonName) === true) {

				//ancient rarity
				allAncients.push(summonName)

			}
			else if (rarityDictionary.legendary.includes(summonName) === true) {

				//legendary rarity
				allLegendaries.push(summonName)

			} else if (rarityDictionary.epic.includes(summonName) === true) {
				//4 stars
				allEpics.push(summonName)

			}

		}
		return ([
			allAncients,
			allLegendaries,
			allEpics
		])
	}
	averagePity(numSummons, numPulled) {
		var floatAveragePity = (numSummons / numPulled)
		var averagePityNumber = Math.round((floatAveragePity + Number.EPSILON) * 100) / 100

		return (averagePityNumber)
	}
}
class EventSummonList extends SummonList {
	constructor(summonData, summonType) {
		super(summonData);
		this.summonTotal = summonData.length
		this.summonType = summonType

		// Event banners sepraration
		let splitEventData = this.splitEventBanners(this.summonData)
		this.separateEventStatistics = {}

		// Create total fifties variables
		this.totalFiftiesWon = 0
		this.totalFiftiesLost = 0

		// Loop through all and create separate event banner stats 
		for (let [eventName, eventSummons] of Object.entries(splitEventData)) {

			let [eventAllAncientsData,
				eventAllLegendariesData,
				eventAllEpicsData] = this.sortRarities(eventSummons)

			let [eventFiftiesWon,
				eventFiftiesLost,
				eventFiftiesWonPercent] = this.countFifties(eventAllLegendariesData, eventName)
			this.totalFiftiesWon += eventFiftiesWon
			this.totalFiftiesLost += eventFiftiesLost

			let eventNumberAncient = eventAllAncientsData.length
			let eventNumberLegendary = eventAllLegendariesData.length
			let eventNumberEpic = eventAllEpicsData.length
			let eventSummonTotal = eventSummons.length

			let eventAverageAncientPity = this.averagePity(eventSummonTotal, eventNumberAncient)
			let eventAverageLegendaryPity = this.averagePity(eventSummonTotal, eventNumberLegendary)
			let eventAverageEpicPity = this.averagePity(eventSummonTotal, eventNumberEpic)

			this.separateEventStatistics[eventName] = {
				"summonTotal": eventSummonTotal,
				"totalLegendaries": eventNumberLegendary,
				"averageLegendaryPity": eventAverageLegendaryPity,
				"fiftiesWon": eventFiftiesWon,
				"fiftiesLost": eventFiftiesLost,
				"fiftiesWonPercent": eventFiftiesWonPercent,
				"totalEpics": eventNumberEpic,
				"averageEpicPity": eventAverageEpicPity
			}

		}

		// Calculate fifties percent when all events ran through
		let floatTotalFiftiesWonPercent = (this.totalFiftiesWon / (this.totalFiftiesWon + this.totalFiftiesLost)) * 100
		this.totalFiftiesWonPercent = Math.round((floatTotalFiftiesWonPercent + Number.EPSILON) * 100) / 100

		let [allAncientsData,
			allLegendariesData,
			allEpicsData] = this.sortRarities(summonData)

		this.numberAncient = allAncientsData.length
		this.numberLegendary = allLegendariesData.length
		this.numberEpic = allEpicsData.length

		let splitLegendaries = this.splitEventBanners(allLegendariesData)
		let [fiftiesWon,
			fiftiesLost,
			fiftiesWonPercent] = this.countFifties(splitLegendaries)
		this.fiftiesWon = fiftiesWon
		this.fiftiesLost = fiftiesLost
		this.fiftiesWonPercent = fiftiesWonPercent

		this.averageAncientPity = this.averagePity(this.summonTotal, this.numberAncient)
		this.averageLegendaryPity = this.averagePity(this.summonTotal, this.numberLegendary)
		this.averageEpicPity = this.averagePity(this.summonTotal, this.numberEpic)

	}
	splitEventBanners(eventSummonData) {
		let splitEventData = {}
		let existingBannersPulled = []

		for (let i = 0; i < eventSummonData.length; i++) {
			summonType = eventSummonData[i][1]

			if (existingBannersPulled.includes(summonType) === true) {
				splitEventData[summonType].push(eventSummonData[i][0])
			}
			else {
				splitEventData[summonType] = []
				splitEventData[summonType].push(eventSummonData[i][0])
				existingBannersPulled.push(summonType);
			}
		}
		return (splitEventData)
	}
	countFifties(separateEventSummons, eventName) {

		const redBannerDictionary = {
			"The One Who Leading into the Future": "Hockney",
			"Khun Family the Lineal Lightning Techinque User": "Khun Ran",
			"Mysterious Doll Maker": "Verdi",
			"Ruler of the Test Floor": "Evankhell",
			"Malice in the Deep Abyss": "Rachel Swallowed the Darkness",
			"Queen Of The No-Names": "Elaine",
			"Cold Lightning's Rage": "Khun Maschenny Jahad",
			"Midsummer's Silent Malice": "Midnight Aurora Rachel",
			"Gorgeous Yeon's Flame": "Yihwa Yeon",
			"The Best Scammer, Khun": "White Heavenly Mirror Khun",
			"The Tower's Idol": "Bong Bong Endorsi",
			"Jinsung Ha, The Great Families Slaughterer": "Jinsung Ha",
			"The Blue Idol Star": "Yura Ha",
			"Ravaged Silver Throne": "White",
			"The Silver Revengeful Soul's Hope, Albelda": "Albelda",
			"Slayer of FUG, Karaka": "Karaka",
			"Sweet Magic Like A Candy": "White Candy Khun",
			"Dogmatic Princess": "Kranos Yuri Ha",
			"The One Who Disobeys His Destiny": "Donghae Hatz",
			"Red-Blooded Judge": "Enryu",
			"Special Operations Commander of the Blazing Sun": "Waterbomb Commander Xiaxia",
			"A Cool Shot in the Middle of the Summer!": "Summer Splash Endorsi",
			"Flame Under The Blazing Sun": "Emerald Ocean Yihwa Yeon",
		
			"Data Urek Mazino's Exclusive Ignition Weapon Pick-up": "Glitch Core",
			"Data Khun Edahn's Exclusive Ignition Weapon Pick-up": "Lightning of the Giant",
			"Hockney's Exclusive Ignition Weapon Pick-up": "Lamplight of Leader",
			"Khun Ran's Exclusive Ignition Weapon Pick-up": "Blue Lightning Nucleus",
			"Verdi's Exclusive Ignition Weapon Pick-up": "Cosmic Pure Octopus",
			"Evankhell's Exclusive Ignition Weapon Pick-up": "Ancient Flare",
			"Rachel Swallowed the Darkness's Exclusive Ignition Weapon Pick-up": "The Lighthouse of Abyss",
			"Elaine's Exclusive Ignition Weapon Pick-up": "Invisible Inventory",
			"Khun Maschenny Jahad's Exclusive Ignition Weapon Pick-up": "The Three Horns",
			"Midnight Aurora Rachel's Exclusive Ignition Weapon Pick-up":"Jellyfish Parasol",
			"Yihwa Yeon's Exclusive Ignition Weapon Pick-up": "Hairpin of Noble Power",
			"White Heavenly Mirror Khun's Exclusive Ignition Weapon Pick-up": "White Heavenly Mirror",
			"Bong Bong Endorsi's Exclusive Ignition Weapon Pick-up": "Bong Bong",
			"Jinsung Ha's Exclusive Ignition Weapon Pick-up": "Fist of the Dragon and Tiger",
			"Yura Ha's Exclusive Ignition Weapon Pick-up": "Top Star's MIC",
			"White's Exclusive Ignition Weapon Pick-up": "Cullinan, Shinsu Sword",
			"Albelda's Exclusive Ignition Weapon Pick-up": "Sword of Revengeful Souls",
			"Karaka's Exclusive Ignition Weapon Pick-up": "Iron Armor's Red Heart",
			"White Candy Khun's Exclusive Ignition Weapon Pick-up": "Magical Candy Cane",
			"Kranos Yuri Ha's Exclusive Ignition Weapon Pick-up": "Kranos",
			"Donghae Hatz's Exclusive Ignition Weapon Pick-up": "Unleashed Donghae",
			"Enryu's Exclusive Ignition Weapon Pick-up": "Red Rain",
			"Waterbomb Commander Xiaxia's Exclusive Ignition Weapon Pick-up": "Black Rabbit Water Gun",
			"Summer Splash Endorsi's Exclusive Ignition Weapon Pick-up ": "Aqua Bong Bong",
			"Emerald Ocean Yihwa Yeon's Exclusive Ignition Weapon Pick-up": "Sparkling Beach Floppy Hat"

		}

		let fiftiesWon = 0
		let fiftiesLost = 0

		//start from bottom of each array, to be in chronological order
		for (let index = separateEventSummons.length - 1; index >= 0; index--) {

			if (separateEventSummons[index] === redBannerDictionary[eventName]) {
				//means won 50/50
				fiftiesWon++
			} else {
				//means 50/50 lost, decrement to skip guaranteed
				fiftiesLost++
				index--
				if (index < 0) { continue }
			}

		}
		let floatFiftiesWonPercent = (fiftiesWon / (fiftiesWon + fiftiesLost)) * 100
		let fiftiesWonPercent = Math.round((floatFiftiesWonPercent + Number.EPSILON) * 100) / 100

		return ([fiftiesWon, fiftiesLost, `${fiftiesWonPercent}%`])
	}
}

module.exports = {
	parseData
}
/*
TESTING 
for (let i=0; i < summonArray.length; i++) {

	console.log("____________________________________________________")
	console.log("number of", summonArray[i].summonType, "summons:", summonArray[i].summonTotal)
	if (i === 1) {
		console.log("total Ancients from", summonArray[i].summonType, "summons:", summonArray[i].numberAncient)
		console.log(summonArray[i].summonType, "average Ancient pity:", summonArray[i].averageAncientPity)
	}
	console.log("total Legendaries from", summonArray[i].summonType, "summons:", summonArray[i].numberLegendary)
	console.log(summonArray[i].summonType, "average Legendary pity:", summonArray[i].averageLegendaryPity)
	if (i === 2) {
		console.log("Total 50/50s taken:", (fiftiesWon + fiftiesLost))
		console.log("50/50s Won:", fiftiesWon)
		console.log("50/50s Lost:", fiftiesLost)
		console.log("50/50 Winrate:", fiftiesWonPercent)
	}
	console.log("total Epics from", summonArray[i].summonType, "summons:", summonArray[i].numberEpic)
	console.log(summonArray[i].summonType, "average Epic pity:", summonArray[i].averageEpicPity)

}
console.log("____________________________________________________")
*/
/*
//TESTING
const test2Url = "https://global-tog-info.ngelgames.com/history/MTAzMzMzOTQ="
const testUrl = "https://global-tog-info.ngelgames.com/history/MTEyMDMzOTA="
const url = 'https://global-tog-info.ngelgames.com/history/MTAyMzIxNjk='

let test = parseData(url)
test.then(function(result) {
	console.log(result) 
 })
 */
