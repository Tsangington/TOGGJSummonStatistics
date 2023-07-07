const { scrapeSummons } = require('./scrapeSummons');

(async function parseData() {
	const url = 'https://global-tog-info.ngelgames.com/history/MTAyMzIxNjk=';
	const totalSummonData = await scrapeSummons(url);

	var redSummonData = [];
	var blueSummonData = [];
	var destinySummonData = [];

	totalSummons = totalSummonData.length
	for (let index=0; index < totalSummonData.length; index++) {
		
		summonType = totalSummonData[index][2]
		if (summonType === "The One Who Opens The Tower's Door" || summonType === "Selective Summon") {
			
			blueSummonData.push(totalSummonData[index])

		} else if (summonType.startsWith("Destiny Summon") === true){
			
			destinySummonData.push(totalSummonData[index])
		
		} else {
			
			redSummonData.push(totalSummonData[index])
		}
	}

	var [redLegendaryCharacterData, redEpicCharacterData,
		redLegendaryWeaponData, redEpicWeaponData	
	] = sortCharacters(redSummonData)
	var [blueLegendaryCharacterData, blueEpicCharacterData,
		blueLegendaryWeaponData, blueEpicWeaponData	
	] = sortCharacters(blueSummonData)
	var [destinyLegendaryCharacterData, destinyEpicCharacterData,
		destinyLegendaryWeaponData, destinyEpicWeaponData	
	] = sortCharacters(destinySummonData)

	var totalLegendaries = redLegendaryCharacterData.length + redLegendaryWeaponData.length + blueLegendaryCharacterData.length + blueLegendaryWeaponData.length + destinyLegendaryCharacterData.length + destinyLegendaryWeaponData.length

	var redSummonTotal = redSummonData.length
	var blueSummonTotal = blueSummonData.length
	var destinySummonTotal = destinySummonData.length

	var totalAvgPity = averagePity(totalSummons, totalLegendaries)
	var redAvgPity = averagePity(redSummonTotal, redLegendaryCharacterData.length + redLegendaryWeaponData.length)

	console.log("Total summons:", totalSummons)
	console.log("Total Average Pity:", totalAvgPity)
	console.log("Red Summon total:", redSummonTotal)
	console.log("Total 5* from Red Summons:", redLegendaryCharacterData.length + redLegendaryWeaponData.length)
	console.log("Average Pity for Red Summons:", redAvgPity)
	console.log("Blue summon total:", blueSummonTotal)
	console.log("Destiny summon total:", destinySummonTotal)

})();

function sortCharacters(summonData) {
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

	for (let index=0; index < summonData.length; index++) {
		summonType = summonData[index][0]
		summonName = summonData[index][1]
		summonBanner = summonData[index][2]
		
		if (summonData[index][0] === "Character"){
			// Character sorting
			if ((characterDictionary.legendary).includes(summonName) === true) {
				//5 stars
				legendaryCharacters.push([summonName, summonBanner])
			
			} else if ((characterDictionary.epic).includes(summonName) === true)  {
				//4 stars
				epicCharacters.push([summonName, summonBanner])

			}
		} else {
			// Weapon sorting
			if ((weaponDictionary.legendary).includes(summonName) === true) {
				
				legendaryWeapons.push([summonName, summonBanner])
			
			} else if ((weaponDictionary.epic).includes(summonName) === true)  {
				
				epicWeapons.push([summonName, summonBanner])
			}
		}
	}
	return(
		[legendaryCharacters, epicCharacters,
		 legendaryWeapons, epicWeapons])
}

function averagePity(numSummons, numPulled) {
	return(numSummons/numPulled)
}
