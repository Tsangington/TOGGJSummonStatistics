// require('dotenv').config()
const express = require('express')
const { logger } = require('./middlewares/logger')
const { getSummonObject } = require('./summonStatistics')
const app = express()
const { Browser } = require('./browser.js')

const environment = 'production'
const browser = new Browser(environment)

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(logger)

app.get('/', (request, response) => {
  response.render('index')
})

app.get('/about', (request, response) => {
  response.render('about')
})

// get their URL
app.get('/summonstatistics', (request, response) => {
  // enter summonStats here
  const parseSummons = getSummonObject(browser, request.query.url)
  parseSummons.then(function (summonStatisticsObject) {
    response.render('summonStatistics',
      { summonStatisticsObject })
  })
})
app.get('/giveurl', (request, response) => {
  response.render('giveUrl')
})

app.listen(process.env.PORT, () => {
  console.log(`Started server on port ${process.env.PORT}`)
})
