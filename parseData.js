const { scrapeSummons } = require('./scrapeSummons');

(async function parseData() {
	const url = 'https://global-tog-info.ngelgames.com/history/MTAyMzIxNjk=';
	const totalSummonData = await scrapeSummons(url);

	var redData = [];
	var blueData = [];
	var destinyData = [];

	totalSummons = totalSummonData.length
	for (let index=0; index < totalSummonData.length; index++) {
		
		summonType = totalSummonData[index][2]
		if (summonType === "The One Who Opens The Tower's Door" || summonType === "Selective Summon") {
			
			blueData.push(totalSummonData[index])

		} else if (summonType.startsWith("Destiny Summon") === true){
			
			destinyData.push(totalSummonData[index])
		
		} else {
			
			redData.push(totalSummonData[index])
		}
	}

	var total = new SummonList(summonData = totalSummonData);
	var red = new SummonList(summonData = redData);
	var blue = new SummonList(summonData = blueData);
	var destiny = new SummonList(summonData = destinyData);

	console.log("Total summons:", total.summonTotal)
	console.log("Total average Legendary pity:", total.averageLegendaryPity)
	console.log("Red summon total:", red.summonTotal)
	console.log("Total 5* from Red summons:", red.numberLegendary)
	console.log("Average Legendary pity for Red summons:", red.averageLegendaryPity)
	console.log("Blue summon total:", blue.summonTotal)
	console.log("Total 5* from Blue summons:", blue.numberLegendary)
	console.log("Average Legendary pity for Blue summons:", blue.averageLegendaryPity)
	console.log("Destiny summon total:", destiny.summonTotal)
	console.log("Total 5* from Destiny summons:", destiny.numberLegendary)
	console.log("Average Legendary pity for Destiny summons:", destiny.averageLegendaryPity)
})();

class SummonList {
	constructor(summonData) {
		this.summonData = summonData
		this.summonTotal = summonData.length
		
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
					"Albeda",
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
