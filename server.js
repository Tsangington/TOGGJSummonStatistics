import 'dotenv/config'
const express = require("express")
const mongoose = require("mongoose")
const { parseData } = require('./parseData');
const { logger } = require("./middlewares/logger");
const app = express()
const port = 8383

mongoose.connect('mongodb://127.0.0.1:27017/TOGGJSummonStatistics')
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error))

app.set('view engine', 'ejs')
app.use(express.static("public"));
app.use(logger)

app.get("/", (request, response) => {
    response.render('index')
})

app.get("/about", (request, response) => {
	response.render('about')
})

// get their URL 
app.get("/summonstatistics", (request, response) => {

    //enter summonStats here
	var parseSummons = parseData(request.query.url)
	parseSummons.then(function(summonStatisticsObject) {
		response.render('summonStatistics', 
		{ "summonStatisticsObject" : summonStatisticsObject })
	})
})
 app.get("/giveurl", (request, response) => {
	
	response.render("giveUrl")
 })

app.listen(process.env.PORT, () => {
	console.log(`Started server on port ${process.env.PORT}`)
})

