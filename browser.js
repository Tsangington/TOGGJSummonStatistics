const { default: puppeteer } = require("puppeteer");

class Browser {
    constructor(environment) {
        if (environment === "development") {
            return(this.development())
        }
        else if (environment === "production") {
            return(this.production())
        }
    }
    async production() { 
        const browserSettings = {
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
        };

        return browserSettings
    }
    async development() {
        const browserSettings = {
            headless: "new"
        }

        return browserSettings
    }
}
module.exports = { 
    Browser 
}