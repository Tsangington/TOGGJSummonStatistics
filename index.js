const puppeteer = require('puppeteer');
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () =>{
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto("https://global-tog-info.ngelgames.com/history/MTAyMzIxNjk=")

    const getMoreButton = '#__next > div.layouts_layoutWrapper__afl7i > main > div > div > div > div.historyPage_moreWrapper__Up_9i > button';
    const isElementVisible = async (page, getMoreButton) => {
        let visible = true;
        await page
          .waitForSelector(getMoreButton, { visible: true, timeout: 2000 })
          .catch(() => {
            visible = false;
          });
        return visible;
    };
      
    let loadMoreVisible = await isElementVisible(page, getMoreButton);
        while (loadMoreVisible) {
            await page
                .click(getMoreButton)
                .catch(() => {});
            loadMoreVisible = await isElementVisible(page, getMoreButton);
    }

    const table = await page.$('#__next > div.layouts_layoutWrapper__afl7i > main > div > div > div > div.historyPage_historyListWrapper__cXHMV > table > tbody');
    const summonData = await page.evaluate((table) => {
        const rows = table.querySelectorAll('tr')
        result = [];

        for (let i=0; i < rows.length; i++) {
            const cells = rows[i].querySelectorAll('th')
            const rowData = [];
            /*cells.length -1 since timestaps not needed */
            for (let j = 0; j < (cells.length-1); j++) {
                rowData.push(cells[j].innerText);
            }
            result.push(rowData);
        }
        return result;
    }, table)
    
    console.log(summonData)

    await browser.close();
})();