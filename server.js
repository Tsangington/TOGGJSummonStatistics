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

// open 
app.get("/summonstatistics", (request, response) => {
    console.log(request.query)

    //enter summonStats here

    response.render('summonStatistics')
})
app.listen(port, () => {
    console.log(`Server has started on port: ${port}`)
})

