const { scrapeSummons } = require('./scrapeSummons')

test('returns a string json object containing the summonData', async () => {
  const summonString = await scrapeSummons('https://global-tog-info.ngelgames.com/history/MTAxMDAwMDE=')
  const summonObject = JSON.parse(summonString[0])
  const summonHistory = summonObject.props.pageProps.histories
  expect(summonHistory[0].logTime).toBe('2023-02-15T01:54:43.000Z')
  return expect(summonHistory[1].logTime).toBe('2023-02-15T01:54:14.000Z')
})
