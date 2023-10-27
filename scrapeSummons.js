const puppeteer = require('puppeteer');
const BrowserObj = require('./browser')

const environment = "production"
const browserSettings = new BrowserObj.Browser(environment)

async function scrapeSummons(url) {
    try {
        console.log(`Starting scrape on the URL: ${url}`)
        const browser = await puppeteer.launch(browserSettings)
        const page = await browser.newPage();
        await page.goto(url)

        const titleNode = await page.$$("#__NEXT_DATA__");
    
        let result = [];
        for(let t of titleNode) {
            result.push(await t.evaluate(x => x.textContent));
        }
        await browser.close();
        console.log(`Finishing scrape on the URL: ${url}`)
        
        return (result)
    }
    catch (error) {
        console.log(error)
    }
};
module.exports = {
    scrapeSummons
};