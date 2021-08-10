const express = require("express")
const app = express()
const path = require("path")

const fs = require('fs')

// app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(__dirname));
// app.set("view engine", "ejs")
// app.set("views", path.join(__dirname, "/views"))

app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

let dataFromFrontEnd = {};

function reportReading() {
    process.stdout.write(dataFromFrontEnd + '\n'); // Write with newline char
    setTimeout(reportReading, Math.random() * 5000); // Wait 0 to 5 seconds
}

app.post("/submit", (req, res) => {
    console.log(req.body)
    dataFromFrontEnd = req.body
    fs.writeFileSync("input.txt", JSON.stringify(dataFromFrontEnd))
    reportReading();


    res.send("fack")
})

app.listen(5500, "127.0.0.1", function () {
    console.log("... port");
})