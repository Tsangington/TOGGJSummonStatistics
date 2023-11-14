const { default: puppeteer } = require("puppeteer");
/* 
Meant to be a browser class for launching different puppeteer envs...
puppeteer does not like like different objects for some reason... 
Currently just passing in the settings depending on env.
*/
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