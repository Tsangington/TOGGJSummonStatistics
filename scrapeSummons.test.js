const { json } = require("JSON");
const {scrapeSummons2} = require("./scrapeSummons");

test('returns a string json object containing the summonData', async () => {
    summonString = await scrapeSummons2("https://global-tog-info.ngelgames.com/history/MTAxMDAwMDE=");
    summonObject = JSON.parse(summonString[0])
    summonHistory = summonObject.props.pageProps.histories
    return expect(summonHistory[0]["logTime"]).toBe("2023-02-15T01:54:43.000Z")
})