const { scrapeSummons } = require('./scrapeSummons');

async function parseData(url) {

	const totalSummonData = await scrapeSummons(url);

	var redData = [];
	var blueData = [];
	var destinyData = [];

	totalSummons = totalSummonData.length
	for (let index=0; index < totalSummonData.length; index++) {
		
		summonType = totalSummonData[index][2]
		if (summonType === "The One Who Opens The Tower's Door" ) { //|| summonType === "Selective Summon"
			
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

	var total = new SummonList(summonData = redData.concat(blueData, destinyData), summonType = "total");
	var red = new SummonList(summonData = redData, summonType = "red");
	var blue = new SummonList(summonData = blueData, summonType = "blue");
	var destiny = new SummonList(summonData = destinyData, summonType = "destiny");

	var printSummons = [total, red, blue, destiny]

	for (let i=0; i<printSummons.length; i++) {

		console.log("number of", printSummons[i].summonType, "summons:", printSummons[i].summonTotal)
		console.log("total Legendaries from", printSummons[i].summonType, "summons:", printSummons[i].numberLegendary)
		console.log(printSummons[i].summonType, "average Legendary pity:", printSummons[i].averageLegendaryPity)
		console.log("total Epics from", printSummons[i].summonType, "summons:", printSummons[i].numberEpic)
		console.log(printSummons[i].summonType, "average Epic pity:", printSummons[i].averageEpicPity)

	}
	
	return (printSummons)
};

class SummonList {
	constructor(summonData, summonType) {
		this.summonData = summonData
		this.summonTotal = summonData.length
		this.summonType = summonType
		
		var [legendaryCharacterData, 
			epicCharacterData,
			legendaryWeaponData, 
			epicWeaponData] = this.sortRarities(summonData)
		
		this.numberLegendary = legendaryCharacterData.length + legendaryWeaponData.length
		this.numberEpic = epicCharacterData.length + epicWeaponData.length

		this.averageLegendaryPity = this.averagePity(this.summonTotal, this.numberLegendary)
		this.averageEpicPity = this.averagePity(this.summonTotal, this.numberEpic)
	}
	sortRarities(summonData) {
	/*Have 4* and 5* characters and weapon names listed here */
		var characterDictionary =
		{
			"legendary":
				[
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
			"legendary":
				[
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

		var legendaryCharacters = [];
		var epicCharacters = [];

		var legendaryWeapons = [];
		var epicWeapons = [];

		for (let index = 0; index < summonData.length; index++) {
			var summonName = summonData[index][1]
			var summonBanner = summonData[index][2]

			if (summonData[index][0] === "Character") {
				// Character sorting
				if ((characterDictionary.legendary).includes(summonName) === true) {
					//5 stars
					legendaryCharacters.push([summonName, summonBanner])

				} else if ((characterDictionary.epic).includes(summonName) === true) {
					//4 stars
					epicCharacters.push([summonName, summonBanner])

				}
			} else {
				// Weapon sorting
				if ((weaponDictionary.legendary).includes(summonName) === true) {

					legendaryWeapons.push([summonName, summonBanner])

				} else if ((weaponDictionary.epic).includes(summonName) === true) {

					epicWeapons.push([summonName, summonBanner])
				}
			}
		}
		return ([
			legendaryCharacters, 
			epicCharacters,
			legendaryWeapons, 
			epicWeapons
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

const url = 'https://global-tog-info.ngelgames.com/history/MTAyMzIxNjk='
parseData(url)	