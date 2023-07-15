const mongoose = require('mongoose');

const urlDataSchema = new mongoose.Schema({
    url : { type: String, required: true },

    allTotalSummons : { type: Number },
    allTotalLegendaries : { type: Number },
    allAverageLegendaryPity : { type: Number },
    allTotalEpics : { type: Number },
    allAverageEpicPity : { type: Number },

    ancientTotalSummons : { type: Number },
    ancientTotalAncients : { type: Number },
    ancientAverageAncientPity : { type: Number },
    ancientTotalLegendaries : { type: Number },
    ancientAverageLegendaryPity : { type: Number },
    ancientTotalEpics : { type: Number },
    ancientAverageEpicPity : { type: Number },

    redTotalSummons : { type: Number },
    redTotalLegendaries : { type: Number },
    redFiftiesWon : { type: Number },
    redFiftiesLost : { type: Number },
    redFiftiesWonPercent : {type: Number},
    redAverageLegendaryPity : { type: Number },
    redTotalEpics : { type: Number },
    redAverageEpicPity : { type: Number },

    blueTotalSummons : { type: Number },
    blueTotalLegendaries : { type: Number },
    blueAverageLegendaryPity : { type: Number },
    blueTotalEpics : { type: Number },
    blueAverageEpicPity : { type: Number },

    destinyTotalSummons : { type: Number },
    destinyTotalLegendaries : { type: Number },
    destinyyAverageLegendaryPity : { type: Number },
    destinyTotalEpics : { type: Number },
    destinyAverageEpicPity : { type: Number },
})

const urlStatistic = mongoose.model('urlStatistic', urlDataSchema)

module.exports = {
    urlStatistic
}