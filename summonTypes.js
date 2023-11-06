const fs = require('fs');

const rarity = JSON.parse(fs.readFileSync('./data/rarity.json').toString());
const banners = JSON.parse(fs.readFileSync('./data/banners.json').toString());

class SummonData {
    constructor(summonData) {
        this.summonData = summonData
        this.summonTotal = summonData.length
    }

    averagePity(numPulled, summonTotal) {
        var floatAveragePity = (summonTotal / numPulled)
        var averagePityNumber = Math.round((floatAveragePity + Number.EPSILON) * 100) / 100

        return (averagePityNumber)
    }

    sortRarities(summonData) {
        var legendaries = [];
        var epics = [];

        for (let index = 0; index < summonData.length; index++) {
                var summonName = summonData[index][0]

            if (rarity.legendary.includes(summonName) === true) {

                legendaries.push(summonName)

            } else if (rarity.epic.includes(summonName) === true) {

                epics.push(summonName)
            }
        }
        return ([
            legendaries, 
            epics
        ])
    }
}

class NormalSummons extends SummonData {
    constructor(summonData) {
        super(summonData);
    }

    getStatistics() {
        var [legendaries, epics] = this.sortRarities(this.summonData)
        this.averageLegendaryPity = this.averagePity(legendaries.length, this.summonTotal)
        this.averageEpicPity = this.averagePity(epics.length, this.summonTotal)

        return {
            "totalSummons": this.summonTotal,
            "totalLegendaries": legendaries.length,
            "averageLegendaryPity": this.averageLegendaryPity,
            "totalEpics": epics.length,
            "averageEpicPity": this.averageEpicPity
        }
    }
}

class RedSummons extends SummonData {
    constructor(summonData) {
        super(summonData);
    }

    splitBanners() {
        let splitBannerData = {}
        let existingBannersPulled = []

        for (let i = 0; i < this.summonData.length; i++) {
            var banner = this.summonData[i][1]

            if (existingBannersPulled.includes(banner) === true) {
                splitBannerData[banner].push(this.summonData[i][0])
            }
            else {
                splitBannerData[banner] = []
                splitBannerData[banner].push(this.summonData[i][0])
                existingBannersPulled.push(banner);
            }
        }
        return (splitBannerData)
    }

    countFifties(separatebannerSummons, eventName) {

        let fiftiesWon = 0
        let fiftiesLost = 0

        //start from bottom of each array, to be in chronological order
        for (let index = separatebannerSummons.length - 1; index >= 0; index--) {

            if (separatebannerSummons[index] === banners.red[eventName]) {
                fiftiesWon++

            } else {

                fiftiesLost++
                index--
                if (index < 0) { continue }
            }

        }
        let floatFiftiesWonPercent = (fiftiesWon / (fiftiesWon + fiftiesLost)) * 100
        let fiftiesWonPercent = Math.round((floatFiftiesWonPercent + Number.EPSILON) * 100) / 100

        return ([fiftiesWon, fiftiesLost, `${fiftiesWonPercent}%`])
    }

    sortBannerRarities(summonData) {
        var legendaries = [];
        var epics = [];

        for (let index = 0; index < summonData.length; index++) {
            var summonName = summonData[index]

            if (rarity.legendary.includes(summonName) === true) {

                legendaries.push(summonName)

            } else if (rarity.epic.includes(summonName) === true) {

                epics.push(summonName)
            }
        }
        return ([
            legendaries,
            epics
        ])
    }

    getBannerStatistics(splitBannerData) {
        this.separateBannerStatistics = {}

        this.totalFiftiesWon = 0
        this.totalFiftiesLost = 0

        for (let [bannerName, bannerSummons] of Object.entries(splitBannerData)) {

            let [legendariesData,
                epicsData] = this.sortBannerRarities(bannerSummons, bannerName)

            let [eventFiftiesWon,
                eventFiftiesLost,
                eventFiftiesWonPercent] = this.countFifties(legendariesData, bannerName)

            this.totalFiftiesWon += eventFiftiesWon
            this.totalFiftiesLost += eventFiftiesLost

            let bannerNumberLegendary = legendariesData.length
            let bannerNumberEpic = epicsData.length
            let bannerSummonTotal = bannerSummons.length

            let eventAverageLegendaryPity = this.averagePity(bannerNumberLegendary, bannerSummonTotal)
            let eventAverageEpicPity = this.averagePity(bannerNumberEpic, bannerSummonTotal)

            this.separateBannerStatistics[bannerName] = {
                "totalSummons": bannerSummonTotal,
                "totalLegendaries": bannerNumberLegendary,
                "averageLegendaryPity": eventAverageLegendaryPity,
                "fiftiesWon": eventFiftiesWon,
                "fiftiesLost": eventFiftiesLost,
                "fiftiesWonPercent": eventFiftiesWonPercent,
                "totalEpics": bannerNumberEpic,
                "averageEpicPity": eventAverageEpicPity
            }
        }
        let floatTotalFiftiesWonPercent = (this.totalFiftiesWon / (this.totalFiftiesWon + this.totalFiftiesLost)) * 100
        this.totalFiftiesWonPercent = `${Math.round((floatTotalFiftiesWonPercent + Number.EPSILON) * 100) / 100}%`
    }

    getStatistics() {
        [this.legendaries, this.epics] = this.sortRarities(this.summonData)
        this.getBannerStatistics(this.splitBanners())
        this.averageLegendaryPity = this.averagePity(this.legendaries.length, this.summonTotal)
        this.averageEpicPity = this.averagePity(this.epics.length, this.summonTotal)

        return {
            "totalSummons": this.summonTotal,
            "totalLegendaries": this.legendaries.length,
            "averageLegendaryPity": this.averageLegendaryPity,
            "fiftiesWon": this.totalFiftiesWon,
            "fiftiesLost": this.totalFiftiesLost,
            "fiftiesWonPercent": this.totalFiftiesWonPercent,
            "totalEpics": this.epics.length,
            "averageEpicPity": this.averageEpicPity,
            "separateBannerStatistics": this.separateBannerStatistics
        }
    }
}

class AncientSummons extends SummonData {
    constructor(summonData) {
        super(summonData);
    }

    splitBanners() {
        let splitBannerData = {}
        let existingBannersPulled = []

        for (let i = 0; i < this.summonData.length; i++) {
            var banner = this.summonData[i][1]

            if (existingBannersPulled.includes(banner) === true) {
                splitBannerData[banner].push(this.summonData[i][0])
            }
            else {
                splitBannerData[banner] = []
                splitBannerData[banner].push(this.summonData[i][0])
                existingBannersPulled.push(banner);
            }
        }
        return (splitBannerData)
    }

    sortRarities(summonData) {
        var ancients = []
        var legendaries = [];
        var epics = [];

        for (let index = 0; index < summonData.length; index++) {	
            var summonName = summonData[index][0]

            if (rarity.ancient.includes(summonName) === true) {

                ancients.push(summonName)
    
            } else if (rarity.legendary.includes(summonName) === true) {

                legendaries.push(summonName)

            } else if (rarity.epic.includes(summonName) === true) {

                epics.push(summonName)
            }
        }
        return ([ancients, legendaries, epics])
    }

    sortBannerRarities(summonData) {
        var ancients = [];
        var legendaries = [];
        var epics = [];

        for (let index = 0; index < summonData.length; index++) {
            var summonName = summonData[index]

            if (rarity.ancient.includes(summonName) === true) {

                ancients.push(summonName)
            }
            else if (rarity.legendary.includes(summonName) === true) {

                legendaries.push(summonName)

            } else if (rarity.epic.includes(summonName) === true) {

                epics.push(summonName)
            }
        }
        return ([
            ancients,
            legendaries,
            epics
        ])
    }

    getBannerStatistics(splitBannerData) {
        this.separateBannerStatistics = {}

        for (let [bannerName, bannerSummons] of Object.entries(splitBannerData)) {

            let [ancientsData,
                legendariesData,
                epicsData] = this.sortBannerRarities(bannerSummons, bannerName)

            let bannerNumberAncient = ancientsData.length
            let bannerNumberLegendary = legendariesData.length
            let bannerNumberEpic = epicsData.length
            let bannerSummonTotal = bannerSummons.length

            let eventAverageAncientPity = this.averagePity(bannerNumberAncient, bannerSummonTotal)
            let eventAverageLegendaryPity = this.averagePity(bannerNumberLegendary, bannerSummonTotal)
            let eventAverageEpicPity = this.averagePity(bannerNumberEpic, bannerSummonTotal)


            this.separateBannerStatistics[bannerName] = {
                "totalSummons": bannerSummonTotal,
                "totalAncients": bannerNumberAncient,
                "averageAncientPity": eventAverageAncientPity,
                "totalLegendaries": bannerNumberLegendary,
                "averageLegendaryPity": eventAverageLegendaryPity,
                "totalEpics": bannerNumberEpic,
                "averageEpicPity": eventAverageEpicPity
            }
        }
    }

    getStatistics() {
        var [ancients, legendaries, epics] = this.sortRarities(this.summonData)
        this.getBannerStatistics(this.splitBanners())
        this.averageAncientPity = this.averagePity(ancients.length, this.summonTotal)
        this.averageLegendaryPity = this.averagePity(legendaries.length, this.summonTotal)
        this.averageEpicPity = this.averagePity(epics.length, this.summonTotal)

        return {
            "totalSummons": this.summonTotal,
            "totalAncients": ancients.length,
            "averageAncientPity": this.averageAncientPity,
            "totalLegendaries": legendaries.length,
            "averageLegendaryPity": this.averageLegendaryPity,
            "totalEpics": epics.length,
            "averageEpicPity": this.averageEpicPity,
            "separateBannerStatistics": this.separateBannerStatistics
        }
    }
}

class DoubleSummons extends SummonData {
    constructor(summonData) {
        super(summonData);
    }

    splitBanners() {
        let splitBannerData = {}
        let existingBannersPulled = []

        for (let i = 0; i < this.summonData.length; i++) {
            var banner = this.summonData[i][1]

            if (existingBannersPulled.includes(banner) === true) {
                splitBannerData[banner].push(this.summonData[i][0])
            }
            else {
                splitBannerData[banner] = []
                splitBannerData[banner].push(this.summonData[i][0])
                existingBannersPulled.push(banner);
            }
        }
        return (splitBannerData)
    }

    sortBannerRarities(summonData) {
        var legendaries = [];
        var epics = [];

        for (let index = 0; index < summonData.length; index++) {
            var summonName = summonData[index]

            if (rarity.legendary.includes(summonName) === true) {

                legendaries.push(summonName)

            } else if (rarity.epic.includes(summonName) === true) {

                epics.push(summonName)
            }
        }
        return ([
            legendaries,
            epics
        ])
    }

    getBannerStatistics(splitBannerData) {
        this.separateBannerStatistics = {}

        for (let [bannerName, bannerSummons] of Object.entries(splitBannerData)) {

            let [legendariesData,
                epicsData] = this.sortBannerRarities(bannerSummons, bannerName)

            let bannerNumberLegendary = legendariesData.length
            let bannerNumberEpic = epicsData.length
            let bannerSummonTotal = bannerSummons.length

            let eventAverageLegendaryPity = this.averagePity(bannerNumberLegendary, bannerSummonTotal)
            let eventAverageEpicPity = this.averagePity(bannerNumberEpic, bannerSummonTotal)

            this.separateBannerStatistics[bannerName] = {
                "totalSummons": bannerSummonTotal,
                "totalLegendaries": bannerNumberLegendary,
                "averageLegendaryPity": eventAverageLegendaryPity,
                "totalEpics": bannerNumberEpic,
                "averageEpicPity": eventAverageEpicPity,
                "legendariesLog": legendariesData
            }
        }
    }

    getStatistics() {
        var [legendaries, epics] = this.sortRarities(this.summonData)
        this.getBannerStatistics(this.splitBanners())
        this.averageLegendaryPity = this.averagePity(legendaries.length, this.summonTotal)
        this.averageEpicPity = this.averagePity(epics.length, this.summonTotal)

        return {
            "totalSummons": this.summonTotal,
            "totalLegendaries": legendaries.length,
            "averageLegendaryPity": this.averageLegendaryPity,
            "totalEpics": epics.length,
            "averageEpicPity": this.averageEpicPity,
            "legendaryLog": this.legendaries,
            "separateBannerStatistics": this.separateBannerStatistics
        }
    }
}

module.exports = {
    NormalSummons,
    RedSummons,
    AncientSummons,
    DoubleSummons
}