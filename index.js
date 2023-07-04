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
    
    await sleep(10000);

    await browser.close();
})();