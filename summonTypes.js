const fs = require('fs')
const { RarityObject } = require('./rarityUtils')
const rarity = JSON.parse(fs.readFileSync('./data/rarity.json').toString())
const banners = JSON.parse(fs.readFileSync('./data/banners.json').toString())

class NormalSummons {
  /*
    The base class which all the other SummonTypes branch out from.
    Has the base methods which most classes will use/overwrite.

    Parameters:
     - summonData: 2D array - [summonName][summonBanner]

  Methods:
    - averagePity:
    - sortRarities:

  The children class also might contain:
    - getStatistics
    - splitBanners
    - countFifties
    - sortBannerRarities
    - getBannerStatistics

    */
  constructor (summonData) {
    this.summonData = summonData
    this.summonTotal = summonData.length
  }

  averagePity (numPulled, summonTotal) {
    const floatAveragePity = (summonTotal / numPulled)
    const averagePityNumber = Math.round((floatAveragePity + Number.EPSILON) * 100) / 100

    return (averagePityNumber)
  }

  sortRarities (summonData) {
    const sortedRarities = new RarityObject(summonData)

    for (let index = 0; index < summonData.length; index++) {
      const summonName = summonData[index][0]

      if (rarity.legendary.includes(summonName) === true) {
        sortedRarities.legendaries.push(summonName)
      } else if (rarity.epic.includes(summonName) === true) {
        sortedRarities.epics.push(summonName)
      }
    }
    return (sortedRarities)
  }

  getStatistics () {
    const sortedRarities = this.sortRarities(this.summonData)
    this.averageLegendaryPity = this.averagePity(sortedRarities.legendaries.length, this.summonTotal)
    this.averageEpicPity = this.averagePity(sortedRarities.epics.length, this.summonTotal)

    return {
      totalSummons: this.summonTotal,
      totalLegendaries: sortedRarities.legendaries.length,
      averageLegendaryPity: this.averageLegendaryPity,
      totalEpics: sortedRarities.epics.length,
      averageEpicPity: this.averageEpicPity
    }
  }
}

class RedSummons extends NormalSummons {
  splitBanners () {
    const splitBannerData = {}
    const existingBannersPulled = []

    for (let i = 0; i < this.summonData.length; i++) {
      const banner = this.summonData[i][1]

      if (existingBannersPulled.includes(banner) === true) {
        splitBannerData[banner].push(this.summonData[i][0])
      } else {
        splitBannerData[banner] = []
        splitBannerData[banner].push(this.summonData[i][0])
        existingBannersPulled.push(banner)
      }
    }
    return (splitBannerData)
  }

  countFifties (separatebannerSummons, eventName) {
    let fiftiesWon = 0
    let fiftiesLost = 0

    // start from bottom of each array, to be in chronological order
    for (let index = separatebannerSummons.length - 1; index >= 0; index--) {
      if (separatebannerSummons[index] === banners.red[eventName]) {
        fiftiesWon++
      } else {
        fiftiesLost++
        index--
        if (index < 0) { continue }
      }
    }
    const floatFiftiesWonPercent = (fiftiesWon / (fiftiesWon + fiftiesLost)) * 100
    const fiftiesWonPercent = Math.round((floatFiftiesWonPercent + Number.EPSILON) * 100) / 100

    return ([fiftiesWon, fiftiesLost, `${fiftiesWonPercent}%`])
  }

  sortBannerRarities (summonData) {
    const legendaries = []
    const epics = []

    for (let index = 0; index < summonData.length; index++) {
      const summonName = summonData[index]

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

  getBannerStatistics (splitBannerData) {
    this.separateBannerStatistics = {}

    this.totalFiftiesWon = 0
    this.totalFiftiesLost = 0

    for (const [bannerName, bannerSummons] of Object.entries(splitBannerData)) {
      const [legendariesData,
        epicsData] = this.sortBannerRarities(bannerSummons, bannerName)

      const [eventFiftiesWon,
        eventFiftiesLost,
        eventFiftiesWonPercent] = this.countFifties(legendariesData, bannerName)

      this.totalFiftiesWon += eventFiftiesWon
      this.totalFiftiesLost += eventFiftiesLost

      const bannerNumberLegendary = legendariesData.length
      const bannerNumberEpic = epicsData.length
      const bannerSummonTotal = bannerSummons.length

      const eventAverageLegendaryPity = this.averagePity(bannerNumberLegendary, bannerSummonTotal)
      const eventAverageEpicPity = this.averagePity(bannerNumberEpic, bannerSummonTotal)

      this.separateBannerStatistics[bannerName] = {
        totalSummons: bannerSummonTotal,
        totalLegendaries: bannerNumberLegendary,
        averageLegendaryPity: eventAverageLegendaryPity,
        fiftiesWon: eventFiftiesWon,
        fiftiesLost: eventFiftiesLost,
        fiftiesWonPercent: eventFiftiesWonPercent,
        totalEpics: bannerNumberEpic,
        averageEpicPity: eventAverageEpicPity
      }
    }
    const floatTotalFiftiesWonPercent = (this.totalFiftiesWon / (this.totalFiftiesWon + this.totalFiftiesLost)) * 100
    this.totalFiftiesWonPercent = `${Math.round((floatTotalFiftiesWonPercent + Number.EPSILON) * 100) / 100}%`
  }

  getStatistics () {
    const sortedRarities = this.sortRarities(this.summonData)
    this.getBannerStatistics(this.splitBanners())
    this.averageLegendaryPity = this.averagePity(sortedRarities.legendaries.length, this.summonTotal)
    this.averageEpicPity = this.averagePity(sortedRarities.epics.length, this.summonTotal)

    return {
      totalSummons: this.summonTotal,
      totalLegendaries: sortedRarities.legendaries.length,
      averageLegendaryPity: this.averageLegendaryPity,
      fiftiesWon: this.totalFiftiesWon,
      fiftiesLost: this.totalFiftiesLost,
      fiftiesWonPercent: this.totalFiftiesWonPercent,
      totalEpics: sortedRarities.epics.length,
      averageEpicPity: this.averageEpicPity,
      separateBannerStatistics: this.separateBannerStatistics
    }
  }
}

class AncientSummons extends NormalSummons {
  splitBanners () {
    const splitBannerData = {}
    const existingBannersPulled = []

    for (let i = 0; i < this.summonData.length; i++) {
      const banner = this.summonData[i][1]

      if (existingBannersPulled.includes(banner) === true) {
        splitBannerData[banner].push(this.summonData[i][0])
      } else {
        splitBannerData[banner] = []
        splitBannerData[banner].push(this.summonData[i][0])
        existingBannersPulled.push(banner)
      }
    }
    return (splitBannerData)
  }

  sortRarities (summonData) {
    const ancients = []
    const legendaries = []
    const epics = []

    for (let index = 0; index < summonData.length; index++) {
      const summonName = summonData[index][0]

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

  sortBannerRarities (summonData) {
    const ancients = []
    const legendaries = []
    const epics = []

    for (let index = 0; index < summonData.length; index++) {
      const summonName = summonData[index]

      if (rarity.ancient.includes(summonName) === true) {
        ancients.push(summonName)
      } else if (rarity.legendary.includes(summonName) === true) {
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

  getBannerStatistics (splitBannerData) {
    this.separateBannerStatistics = {}

    for (const [bannerName, bannerSummons] of Object.entries(splitBannerData)) {
      const [ancientsData,
        legendariesData,
        epicsData] = this.sortBannerRarities(bannerSummons, bannerName)

      const bannerNumberAncient = ancientsData.length
      const bannerNumberLegendary = legendariesData.length
      const bannerNumberEpic = epicsData.length
      const bannerSummonTotal = bannerSummons.length

      const eventAverageAncientPity = this.averagePity(bannerNumberAncient, bannerSummonTotal)
      const eventAverageLegendaryPity = this.averagePity(bannerNumberLegendary, bannerSummonTotal)
      const eventAverageEpicPity = this.averagePity(bannerNumberEpic, bannerSummonTotal)

      this.separateBannerStatistics[bannerName] = {
        totalSummons: bannerSummonTotal,
        totalAncients: bannerNumberAncient,
        averageAncientPity: eventAverageAncientPity,
        totalLegendaries: bannerNumberLegendary,
        averageLegendaryPity: eventAverageLegendaryPity,
        totalEpics: bannerNumberEpic,
        averageEpicPity: eventAverageEpicPity
      }
    }
  }

  getStatistics () {
    const [ancients, legendaries, epics] = this.sortRarities(this.summonData)
    this.getBannerStatistics(this.splitBanners())
    this.averageAncientPity = this.averagePity(ancients.length, this.summonTotal)
    this.averageLegendaryPity = this.averagePity(legendaries.length, this.summonTotal)
    this.averageEpicPity = this.averagePity(epics.length, this.summonTotal)

    return {
      totalSummons: this.summonTotal,
      totalAncients: ancients.length,
      averageAncientPity: this.averageAncientPity,
      totalLegendaries: legendaries.length,
      averageLegendaryPity: this.averageLegendaryPity,
      totalEpics: epics.length,
      averageEpicPity: this.averageEpicPity,
      separateBannerStatistics: this.separateBannerStatistics
    }
  }
}

class DoubleSummons extends NormalSummons {
  splitBanners () {
    const splitBannerData = {}
    const existingBannersPulled = []

    for (let i = 0; i < this.summonData.length; i++) {
      const banner = this.summonData[i][1]

      if (existingBannersPulled.includes(banner) === true) {
        splitBannerData[banner].push(this.summonData[i][0])
      } else {
        splitBannerData[banner] = []
        splitBannerData[banner].push(this.summonData[i][0])
        existingBannersPulled.push(banner)
      }
    }
    return (splitBannerData)
  }

  sortBannerRarities (summonData) {
    const legendaries = []
    const epics = []

    for (let index = 0; index < summonData.length; index++) {
      const summonName = summonData[index]

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

  getBannerStatistics (splitBannerData) {
    this.separateBannerStatistics = {}

    for (const [bannerName, bannerSummons] of Object.entries(splitBannerData)) {
      const sortedRarities = this.sortBannerRarities(bannerSummons, bannerName)

      const bannerNumberLegendary = sortedRarities.legendaries.length
      const bannerNumberEpic = sortedRarities.epics.length
      const bannerSummonTotal = bannerSummons.length

      const eventAverageLegendaryPity = this.averagePity(bannerNumberLegendary, bannerSummonTotal)
      const eventAverageEpicPity = this.averagePity(bannerNumberEpic, bannerSummonTotal)

      this.separateBannerStatistics[bannerName] = {
        totalSummons: bannerSummonTotal,
        totalLegendaries: bannerNumberLegendary,
        averageLegendaryPity: eventAverageLegendaryPity,
        totalEpics: bannerNumberEpic,
        averageEpicPity: eventAverageEpicPity,
        legendariesLog: sortedRarities.legendaries
      }
    }
  }

  getStatistics () {
    const sortedRarities = this.sortRarities(this.summonData)
    this.getBannerStatistics(this.splitBanners())
    this.averageLegendaryPity = this.averagePity(sortedRarities.legendaries.length, this.summonTotal)
    this.averageEpicPity = this.averagePity(sortedRarities.epics.length, this.summonTotal)

    return {
      totalSummons: this.summonTotal,
      totalLegendaries: sortedRarities.legendaries.length,
      averageLegendaryPity: this.averageLegendaryPity,
      totalEpics: sortedRarities.epics.length,
      averageEpicPity: this.averageEpicPity,
      legendaryLog: this.legendaries,
      separateBannerStatistics: this.separateBannerStatistics
    }
  }
}

module.exports = {
  NormalSummons,
  RedSummons,
  AncientSummons,
  DoubleSummons
}
