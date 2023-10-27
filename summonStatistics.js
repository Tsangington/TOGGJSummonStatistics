const fs = require('fs');
const SummonType = require("./summonTypes.js")
const banners = JSON.parse(fs.readFileSync('./data/banners.json').toString());

class SummonStatistics{
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
    constructor(totalSummonData) {
        this.summonData = totalSummonData
    }
    
    splitSummonTypes(totalSummonData) {

        var ancientData = [];
        var redData = [];
        var blueData = [];
        var destinyData = [];
        var doubleData = []

        var totalSummons = totalSummonData.length
        var ancientBanners = banners.ancient
        var doubleBanners = banners.double
    
        for (let index = 0; index < totalSummons; index++) {
            var summonType = totalSummonData[index][1]
            if (summonType in ancientBanners  === true) {
    
                ancientData.push(totalSummonData[index])
    
            } else if (summonType in doubleBanners) {

                doubleData.push(totalSummonData[index])

            } else if (summonType === "The One Who Opens The Tower's Door") { //|| summonType === "Selective Summon"
    
                blueData.push(totalSummonData[index])
    
            } else if (summonType.startsWith("Destiny Summon") === true) {
    
                destinyData.push(totalSummonData[index])
    
            } else if (summonType.startsWith("Selective Summon") === true) {
                continue
            }
            else {
    
                redData.push(totalSummonData[index])
            }
        }
        return ([ancientData, redData, blueData, destinyData, doubleData]) 
    }
    
    getSummonObject() {
        var [ancientData, redData, blueData, destinyData, doubleData] = this.splitSummonTypes(this.summonData)

        var total = new SummonType.NormalSummons(redData.concat(blueData, destinyData))
        var ancient = new SummonType.AncientSummons(ancientData)
        var red = new SummonType.RedSummons(redData)
        var blue = new SummonType.NormalSummons(blueData)
        var destiny = new SummonType.NormalSummons(destinyData)
        var double = new SummonType.DoubleSummons(doubleData)

        return {
            "Total": total.getStatistics(),
            "Ancient": ancient.getStatistics(),
            "Red" : red.getStatistics(),
            "Blue": blue.getStatistics(),
            "Destiny": destiny.getStatistics(),
            "Double": double.getStatistics()
        }
    }
}

module.exports = {
    SummonStatistics
}