const { json } = require("JSON");
const {parseData, getSummonObject} = require("./parseData");


test('Parses the data into correct formats and has the necessary data', async () => {
    summonData = await parseData("https://global-tog-info.ngelgames.com/history/MTAxMDAwMDE=")
    expect(summonData[0]).toStrictEqual(["Shinheuh Cutlass", "The One Who Opens The Tower's Door"])
    return expect(summonData[1]).toStrictEqual(["Pink Rune Stick", "The One Who Opens The Tower's Door"])
})

test("SummonObject is returned from getSummonObject function", async () => {
    summonObject = await getSummonObject("https://global-tog-info.ngelgames.com/history/MTAxMDAwMDE=")
    return expect(Object.keys(summonObject).length).toBe(6)
})

