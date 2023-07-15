const puppeteer = require('puppeteer');

async function scrapeSummons(url) {
    const browser = await puppeteer.launch();
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
                .catch(() => {});
            loadMoreVisible = await isElementVisible(page, getMoreButtonSelector);
    }

    /*Parse table data*/ 
    const tableSelector = '#__next > div.layouts_layoutWrapper__afl7i > main > div > div > div > div.historyPage_historyListWrapper__cXHMV > table > tbody'
    const table = await page.$(tableSelector);
    const summonData = await page.evaluate((table) => {
        const rows = table.querySelectorAll('tr')
        result = [];

        for (let i=0; i < rows.length; i++) {
            const cells = rows[i].querySelectorAll('th')
            const rowData = [];
            /*cells.length -1 since timestamps not needed */
            for (let j = 0; j < (cells.length-1); j++) {
                rowData.push(cells[j].innerText);
            }
            result.push(rowData);
        }
        return result;
    }, table)
    
    await browser.close();
    return summonData
};
module.exports = {
    scrapeSummons
};