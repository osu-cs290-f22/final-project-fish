var express = require("express")

var app = express()
var port = 3000

app.get("/about", function (req, res, next) {
    console.log("== Request received")
    console.log("  -- req.url:", req.url)
    console.log("  -- req.method:", req.method)
    res.status(200).sendFile(__dirname + "/public/about.html")
})

app.get("*", function (req, res, next) {
    console.log("== Request received")
    console.log("  -- req.url:", req.url)
    console.log("  -- req.method:", req.method)
    res.status(404).sendFile(__dirname + "/public/index.html")
})

app.listen(port, function () {
    console.log("== Server is listening on port:", port)
})
