const { Browser } = require('./browser')
const { scrapeSummons, parseData } = require('./scrapeSummons')
const fs = require('fs')

test('returns an object with the raw summon history data', async () => {
  const browser = new Browser('production')
  const testUrl = 'https://global-tog-info.ngelgames.com/history/MTAxMDAwMDE='
  const summonData = await scrapeSummons(browser, testUrl)
  return expect(typeof summonData).toBe('object')
})

test('parses the raw summon history data into the correct format for use', async () => {
  const browser = new Browser('production')
  const testUrl = 'https://global-tog-info.ngelgames.com/history/MTAxMDAwMDE='
  const summonData = await scrapeSummons(browser, testUrl)
  const parsedData = await parseData(summonData)
  console.log(parsedData)
  expect(parsedData[0][0]).toBe('Shinheuh Cutlass')
  return expect(parsedData[0][1]).toBe("The One Who Opens The Tower's Door")
})
