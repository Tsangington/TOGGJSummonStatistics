const puppeteer = require('puppeteer');

async function scrapeSummons(url) {
    try {
        console.log(`Starting scrape on the URL:${url}`)
        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--disable-setuid-sandbox",
                "--no-sandbox",
                "--single-process",
                "--no-zygote"
            ],
            executablePath: process.env.NODE_ENV === 'production'
                ? process.env.PUPPETER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
        });
        const page = await browser.newPage();
        await page.goto(url)

        const getMoreButtonSelector = '#__next > div.layouts_layoutWrapper__afl7i > main > div > div > div > div.historyPage_moreWrapper__Up_9i > button';
        /*Click the more button until hidden - meaning table is fully revealed*/
        const isElementVisible = async (page, getMoreButtonSelector) => {
            let visible = true;
            await page
                .waitForSelector(getMoreButtonSelector, { visible: true, timeout: 2000 })
                .catch(() => {
                    visible = false;
                });
            return visible;
        };

        let loadMoreVisible = await isElementVisible(page, getMoreButtonSelector);
        while (loadMoreVisible) {
            await page
                .click(getMoreButtonSelector)
                .catch(() => { });
            loadMoreVisible = await isElementVisible(page, getMoreButtonSelector);
        }

        /*Parse table data*/
        const tableSelector = '#__next > div.layouts_layoutWrapper__afl7i > main > div > div > div > div.historyPage_historyListWrapper__cXHMV > table > tbody'
        const table = await page.$(tableSelector);
        const summonData = await page.evaluate((table) => {
            const rows = table.querySelectorAll('tr')
            result = [];

            for (let i = 0; i < rows.length; i++) {
                const cells = rows[i].querySelectorAll('th')
                const rowData = [];
                /* start with 1 to remove first column, cells.length -1 since timestamps not needed */
                for (let j = 1; j < (cells.length - 1); j++) {
                    rowData.push(cells[j].innerText);
                }
                result.push(rowData);
            }
            return result;
        }, table)

        await browser.close();
        console.log(`Finishing scrape on the URL:${url}`)
        return summonData
    }
    catch (error) {
        console.log(error)
    }
};
async function scrapeSummons2(url) {
    try {
        console.log(`Starting scrape on the URL:${url}`)
        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--disable-setuid-sandbox",
                "--no-sandbox",
                "--single-process",
                "--no-zygote"
            ],
            executablePath: process.env.NODE_ENV === 'production'
                ? process.env.PUPPETER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
        });
        const page = await browser.newPage();
        await page.goto(url)

        const titleNode = await page.$$("#__NEXT_DATA__");
    
        let result = [];
        for(let t of titleNode) {
            result.push(await t.evaluate(x => x.textContent));
        }
        await browser.close();
        console.log(`Finishing scrape on the URL:${url}`)
        
        return (result)
    }
    catch (error) {
        console.log(error)
    }
};
module.exports = {
    scrapeSummons,
    scrapeSummons2
};