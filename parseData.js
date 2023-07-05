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

	var [redFiveStarCharacterData, redFourStarCharacterData, redThreeStarCharacterData,
		redFiveStarWeaponData, redFourStarWeaponData, redThreeStarWeaponData	
	] = sortCharacters(redSummonData)

	var redSummonTotal = redSummonData.length
	var blueSummonTotal = blueSummonData.length
	var destinySummonTotal = destinySummonData.length

	console.log("Total summons:", totalSummons)
	console.log("Red Summon total:", redSummonTotal)
	console.log("Total 5* from Red Summons:", redFiveStarCharacterData.length)
	console.log(redFiveStarCharacterData)
	console.log("Blue summon total:", blueSummonTotal)
	console.log("Destiny summon total:", destinySummonTotal)

})();

function sortCharacters(summonData) {
/*Have 4* and 5* characters and weapon names listed here */
	var characterDictionary = 
	{
		"fiveStar":
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
		"fourStar":
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
		"fiveStar":
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
		"fourStar":
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

	var fiveStarCharacters = [];
	var fourStarCharacters = [];
	var threeStarCharacters = [];
	var fiveStarWeapons = [];
	var fourStarWeapons = [];
	var threeStarWeapons = [];

	for (let index=0; index < summonData.length; index++) {
		summonType = summonData[index][0]
		summonName = summonData[index][1]
		summonBanner = summonData[index][2]
		
		if (summonData[index][0] === "Character"){
			// Character sorting
			if ((characterDictionary.fiveStar).includes(summonName) === true) {
				//5 stars
				fiveStarCharacters.push([summonName, summonBanner])
			
			} else if ((characterDictionary.fourStar).includes(summonName) === true)  {
				//4 stars
				fourStarCharacters.push([summonName, summonBanner])

			} else {
				//3 stars
				threeStarCharacters.push([summonName, summonBanner])
			}
		} else {
			// Weapon sorting
			if ((weaponDictionary.fiveStar).includes(summonName) === true) {
				
				fiveStarWeapons.push([summonName, summonBanner])
			
			} else if ((weaponDictionary.fourStar).includes(summonName) === true)  {
				
				fourStarWeapons.push([summonName, summonBanner])
			} else {
				//3 star
				threeStarWeapons.push([summonName, summonBanner])
			}
		}
	}
	return(
		[fiveStarCharacters, fourStarCharacters, threeStarCharacters,
		 fiveStarWeapons, fourStarWeapons, threeStarWeapons])
}