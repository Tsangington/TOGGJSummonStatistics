const { json } = require("JSON");
const {parseData} = require("./parseData");

test('Parses the data into correct formats and has the necessary data', async () => {
    summonObject = await parseData("https://global-tog-info.ngelgames.com/history/MTAxMDAwMDE=")
    return expect(summonObject["Total"]["totalSummons"]).toBe(13)
})