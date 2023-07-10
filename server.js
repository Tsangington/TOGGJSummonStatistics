const express = require("express")
const { parseData } = require('./parseData');
const app = express()
const port = 8383

app.use(express.static("public"))

app.get("/", (req, res) => {
})

app.listen(port, () => {
    console.log(`Server has started on port: ${port}`)
})

