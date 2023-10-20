const { json } = require("JSON");
const {parseData, SummonList} = require("./parseData");

test('Parses the data into correct formats and has the necessary data', async () => {
    summonObject = await parseData("https://global-tog-info.ngelgames.com/history/MTAxMDAwMDE=")
    return expect(summonObject["Total"]["totalSummons"]).toBe(13)
})

test('Average Pity calculation is working correctly', () => {
    testSummons = new SummonList(summonData = [
        ['Bone Stick', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up"],
        ['Redpoint Bow', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up"],
        ['Wide Spear', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up"],
        ['Blue Rune Hammer', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up"],
        ['Rapier', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up"],
        ['Bone Blade', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up"],
        ['Blue Rune Bow', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up"],
        ['Purple Rune Rod', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up" ],
        ['Maschenny Sword', "Data Khun Maschenny's Exclusive Ignition Weapon Pick-up" ]
    ])
    return expect(testSummons.averagePity(testSummons.summonTotal ,testSummons.numberLegendary)).toBe(9)
})