const express = require("express")
const { parseData } = require('./parseData');
const { logger } = require("./middlewares/logger");
const app = express()
const port = 8383

app.set('view engine', 'ejs')
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(logger)

app.get("/", (request, response) => {
    response.render('index')
})

// get their URL 
app.get("/summonstatistics", (request, response) => {
    console.log(request.query)

    //enter summonStats here

    response.render('summonStatistics', { "summonStatisticsObject" : {
        total: {
          totalSummons: 2714,
          totalLegendaries: 62,
          averageLegendaryPity: 43.77,
          totalEpics: 379,
          averageEpicPity: 7.16
        },
        ancient: {
          totalSummons: 10,
          totalLegendaries: 0,
          averageLegendaryPity: Infinity,
          totalEpics: 1,
          averageEpicPity: 10,
          totalAncients: 0,
          averageAncientPity: Infinity
        },
        red: {
          totalSummons: 1187,
          totalLegendaries: 27,
          averageLegendaryPity: 43.96,
          totalEpics: 163,
          averageEpicPity: 7.28,
          fiftiesWon: 10,
          fiftiesLost: 9,
          fiftiesWonPercent: 52.63
        },
        blue: {
          totalSummons: 1407,
          totalLegendaries: 33,
          averageLegendaryPity: 42.64,
          totalEpics: 197,
          averageEpicPity: 7.14
        },
        destiny: {
          totalSummons: 110,
          totalLegendaries: 2,
          averageLegendaryPity: 55,
          totalEpics: 18,
          averageEpicPity: 6.11
        }
      }
    }) 
    
})
app.listen(port, () => {
    console.log(`Server has started on port: ${port}`)
})

