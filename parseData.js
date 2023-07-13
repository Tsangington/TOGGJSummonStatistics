const { scrapeSummons } = require('./scrapeSummons');

async function parseData(url) {

	const totalSummonData = await scrapeSummons(url);

	[ancientData, redData, blueData, destinyData] = splitSummonTypes(totalSummonData)

	var total = new SummonList(summonData = ancientData.concat(redData, blueData, destinyData), summonType = "total");
	var ancient = new SummonList(summonData = ancientData, summonType = "ancient")
	var red = new SummonList(summonData = redData, summonType = "red");
	var blue = new SummonList(summonData = blueData, summonType = "blue");
	var destiny = new SummonList(summonData = destinyData, summonType = "destiny");
	
	var printSummons = [total, ancient, red, blue, destiny]

	splitRedBanners(red.allLegendariesData)

	for (let i=0; i < printSummons.length; i++) {

		console.log("number of", printSummons[i].summonType, "summons:", printSummons[i].summonTotal)
		if (i === 1){
			console.log("total Ancients from", printSummons[i].summonType, "summons:", printSummons[i].numberAncient)
			console.log(printSummons[i].summonType, "average Ancient pity:", printSummons[i].averageAncientPity)
		}
		console.log("total Legendaries from", printSummons[i].summonType, "summons:", printSummons[i].numberLegendary)
		console.log(printSummons[i].summonType, "average Legendary pity:", printSummons[i].averageLegendaryPity)
		console.log("total Epics from", printSummons[i].summonType, "summons:", printSummons[i].numberEpic)
		console.log(printSummons[i].summonType, "average Epic pity:", printSummons[i].averageEpicPity)

	}
	
	return (printSummons)
};

function splitSummonTypes(totalSummonData) {
	
	var ancientData = [];
	var redData = [];
	var blueData = [];
	var destinyData = [];

	totalSummons = totalSummonData.length
	ancientBanners = ["The Aloof Wave of the Tower", "Poe Bidau Gustang's Exclusive Ignition Weapon."]

	for (let index=0; index < totalSummons; index++) {
		summonType = totalSummonData[index][2]
		if ( ancientBanners.includes(summonType) === true) {

			ancientData.push(totalSummonData[index])

		}
		else if (summonType === "The One Who Opens The Tower's Door" ) { //|| summonType === "Selective Summon"
			
			blueData.push(totalSummonData[index])

		} else if (summonType.startsWith("Destiny Summon") === true){
			
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

function splitRedBanners(redSummonData) {
	var splitRedSummons = {}
	var existingBannersPulled = []
	var redCharacterDictionary = {

		"Yihwa Yeon": "Gorgeous Yeon's Flame",
		"White Heavenly Mirror Khun": "The Best Scammer, Khun",
		"Bong Bong Endorsi": "The Tower's Idol",
		"Jinsung Ha": "Jinsung Ha, The Great Families Slaughterer",
		"Yura Ha": "The Blue Idol Star",
		"White": "Ravaged Silver Throne",
		"Albelda": "The Silver Revengeful Soul's Hope, Albelda",
		"Karaka": "Slayer of FUG, Karaka",
		"White Candy Khun": "Sweet Magic Like A Candy",
		"Kranos Yuri Ha": "Dogmatic Princess",
		"Donghae Hatz": "The One Who Disobeys His Destiny",
		"Enryu": "Red-Blooded Judge",
		"Waterbomb Commander Xiaxia": "Special Operations Commander of the Blazing Sun",
		"Summer Splash Endorsi": "A Cool Shot in the Middle of the Summer!",
		"Emerald Ocean Yihwa Yeon": "Flame Under The Blazing Sun"

	}
	var redWeaponDictionary = {

		"Hairpin of Noble Power": "Yihwa Yeon's Exclusive Ignition Weapon Pick-up",
		"White Heavenly Mirror": "White Heavenly Mirror Khun's Exclusive Ignition Weapon Pick-up",
		"Bong Bong": "Bong Bong Endorsi's Exclusive Ignition Weapon Pick-up",
		"Fist of the Dragon and Tiger": "Jinsung Ha's Exclusive Ignition Weapon Pick-up",
		"Top Star's MIC": "Yura Ha's Exclusive Ignition Weapon Pick-up",
		"Cullinan, Shinsu Sword": "White's Exclusive Ignition Weapon Pick-up",
		"Sword of Revengeful Souls": "Albelda's Exclusive Ignition Weapon Pick-up",
		"Iron Armor's Red Heart": "Karaka's Exclusive Ignition Weapon Pick-up",
		"Magical Candy Cane": "White Candy Khun's Exclusive Ignition Weapon Pick-up",
		"Kranos": "Kranos Yuri Ha's Exclusive Ignition Weapon Pick-up",
		"Unleashed Donghae": "Donghae Hatz's Exclusive Ignition Weapon Pick-up",
		"Red Rain": "Enryu's Exclusive Ignition Weapon Pick-up",
		"Black Rabbit Water Gun": "Waterbomb Commander Xiaxia's Exclusive Ignition Weapon Pick-up",
		"Aqua Bong Bong": "Summer Splash Endorsi's Exclusive Ignition Weapon Pick-up ",
		"Sparkling Beach Floppy Hat": "Emerald Ocean Yihwa Yeon's Exclusive Ignition Weapon Pick-up"

	}

	for (let i=0; i < redSummonData.length; i++) {
		summonType = redSummonData[i][1]

		if (existingBannersPulled.includes(summonType) === true ) {
			splitRedSummons[summonType].push(redSummonData[i][0])
		}
		else {
			splitRedSummons[summonType] = []
			splitRedSummons[summonType].push(redSummonData[i][0])
			existingBannersPulled.push(summonType);
		}
	}
	console.log(splitRedSummons)
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
		var characterDictionary =
		{
			"ancient":
				["Poe Bidau Gustang"],
			"legendary":
				[
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
					"Donghae Hatz"
				],
			"epic":
				[
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
					"Boro"
				]
		};
		var weaponDictionary =
		{
			"ancient":
				["Ancient Book of Origin"],
			"legendary":
				[
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
			var summonName = summonData[index][1]
			var summonBanner = summonData[index][2]

			// Character and weapon Sorting
			if ( characterDictionary.ancient.includes(summonName) === true ||
			weaponDictionary.ancient.includes(summonName) === true) {

				//ancient rarity
				allAncients.push([summonName, summonBanner])

			}
			else if ( characterDictionary.legendary.includes(summonName) === true ||
			weaponDictionary.legendary.includes(summonName) === true) {

				//legendary rarity
				allLegendaries.push([summonName, summonBanner])

			} else if ((characterDictionary.epic).includes(summonName) === true ||
			weaponDictionary.epic.includes(summonName) === true) {
				//4 stars
				allEpics.push([summonName, summonBanner])

			}
			
		}
		return ([
			allAncients,
			allLegendaries,
			allEpics
		])
	}
	averagePity(numSummons, numPulled) {
		var averagePityNumber = (numSummons/numPulled)
		return (averagePityNumber)
	}
}
module.exports = {
	parseData
}
const test2Url = "https://global-tog-info.ngelgames.com/history/MTAzMzMzOTQ="
const testUrl = "https://global-tog-info.ngelgames.com/history/MTEyMDMzOTA="
const url = 'https://global-tog-info.ngelgames.com/history/MTAyMzIxNjk='
parseData(test2Url)	