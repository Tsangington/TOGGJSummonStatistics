const fs = require('fs')
const SummonType = require('./summonTypes.js')
const banners = JSON.parse(fs.readFileSync('./data/banners.json').toString())
const { parseData } = require('./scrapeSummons.js')
const { scrapeSummons } = require('./scrapeSummons.js')

async function getSummonObject (browser, url) {
  /*
    Takes the URL, gets the parsedSummonData array and creates the
    SummonObject that will be passed to the frontend

    Parameters:
     - URL: string - To find the correct summon history to read from

    Returns:
     - SummonObject : Object - Object with all the summonTypes and statistics
      to be shown in the front-end
    */
  const rawSummonData = await scrapeSummons(browser, url)
  const parsedSummonData = await parseData(rawSummonData)
  const summonStatistics = new SummonStatistics(parsedSummonData)

  return summonStatistics.getSummonObject()
}

class SummonStatistics {
  /*
    The class which handles the overall creation of the object that
    is going to be passed into the front-end.

    Parameters:
     - totalSummonData: 2D array

    Methods:
     - splitSummonTypes - Splits the summons into their categories for
        further sorting
        - Returns a 3D array [summonType][summonName][SummonBanner]
     - getSummonObject - prepares the object to be sent to the fronted
        - Parameters: None
        - Returns said object
    */
  constructor (totalSummonData) {
    this.summonData = totalSummonData
  }

  splitSummonTypes (totalSummonData) {
    const ancientData = []
    const redData = []
    const blueData = []
    const destinyData = []
    const doubleData = []
    const collabData = []

    const totalSummons = totalSummonData.length
    const ancientBanners = banners.ancient
    const doubleBanners = banners.double
    const collabBanners = banners.collab

    for (let index = 0; index < totalSummons; index++) {
      const summonType = totalSummonData[index][1]
      if (summonType in ancientBanners === true) {
        ancientData.push(totalSummonData[index])
      } else if (summonType in doubleBanners) {
        doubleData.push(totalSummonData[index])
      } else if (summonType in collabBanners) {
        collabData.push(totalSummonData[index])
      } else if (summonType === "The One Who Opens The Tower's Door") {
        blueData.push(totalSummonData[index])
      } else if (summonType.startsWith('Destiny Summon') === true) {
        destinyData.push(totalSummonData[index])
      } else if (summonType.startsWith('Selective Summon') === true) {
        continue
      } else {
        redData.push(totalSummonData[index])
      }
    }
    return ([ancientData, redData, blueData, destinyData, doubleData, collabData])
  }

  getSummonObject () {
    const [ancientData, redData, blueData, destinyData, doubleData, collabData] = this.splitSummonTypes(this.summonData)

    const total = new SummonType.NormalSummons(redData.concat(blueData, destinyData, doubleData, collabData))
    const ancient = new SummonType.AncientSummons(ancientData)
    const red = new SummonType.RedSummons(redData)
    const blue = new SummonType.NormalSummons(blueData)
    const destiny = new SummonType.NormalSummons(destinyData)
    const double = new SummonType.DoubleSummons(doubleData)
    const collab = new SummonType.CollabSummons(collabData)

    return {
      Total: total.getStatistics(),
      Ancient: ancient.getStatistics(),
      Red: red.getStatistics(),
      Blue: blue.getStatistics(),
      Destiny: destiny.getStatistics(),
      Double: double.getStatistics(),
      Collab: collab.getStatistics()
    }
  }
}

module.exports = {
  SummonStatistics,
  getSummonObject
}
