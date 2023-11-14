const puppeteer = require('puppeteer')
const BrowserObj = require('./browser')
const json = require('JSON')

const environment = 'production'
const browserSettings = new BrowserObj.Browser(environment)

async function parseData (rawSummonData) {
  /*
    Takes the URL, then uses the subsequent JSON object to create
    a smaller object for quicker data sorting later on

    Parameters:
     - URL: string - To find the correct summon history to read from

    Returns:
     - parsedSummonData: array - a 2D array to be used later on
    */
  const parsedSummonData = []
  const summonData = json.parse(rawSummonData)
  const summonHistory = summonData.props.pageProps.histories

  for (let index = 0; index < summonHistory.length; index++) {
    parsedSummonData.push([summonHistory[index].itemName, summonHistory[index].gachaName])
  }

  return parsedSummonData
};

async function scrapeSummons (url) {
  /*
    Takes in a URL to scrape from and return a stringified JSON object for
    further parsing.

    Parameters:
     - URL: string - To find the correct summon history to read from

    Returns:
     - result: string - stringified JSON object to be used later on
    */

  try {
    console.log(`Starting scrape on the URL: ${url}`)
    const browser = await puppeteer.launch(browserSettings)
    const page = await browser.newPage()
    await page.goto(url)

    const titleNode = await page.$$('#__NEXT_DATA__')

    const result = []
    for (const t of titleNode) {
      result.push(await t.evaluate(x => x.textContent))
    }
    await browser.close()
    console.log(`Finishing scrape on the URL: ${url}`)

    return (result)
  } catch (error) {
    console.log(error)
  }
};
module.exports = {
  scrapeSummons,
  parseData
}
