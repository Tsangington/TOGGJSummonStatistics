const { default: puppeteer } = require('puppeteer')
/*
Meant to be a browser class for launching different puppeteer envs...
puppeteer does not like like different objects for some reason...
Currently just passing in the settings depending on env.
*/
class Browser {
  constructor (environment) {
    if (environment === 'development') {
      this.browserSettings = this.development()
    } else if (environment === 'production') {
      this.browserSettings = this.production()
    }
  }

  get launch () {
    const browser = puppeteer.launch(this.browserSettings)
    return browser
  }

  async production () {
    const browserSettings = {
      headless: 'new',
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--single-process',
        '--no-zygote'
      ],
      executablePath: process.env.NODE_ENV === 'production'
        ? process.env.PUPPETER_EXECUTABLE_PATH
        : puppeteer.executablePath()
    }

    return browserSettings
  }

  async development () {
    const browserSettings = {
      headless: 'new'
    }

    return browserSettings
  }
}
module.exports = {
  Browser
}
