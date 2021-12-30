const express = require("express")
const app = express()
const path = require("path")

// app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(__dirname));
// app.set("view engine", "ejs")
// app.set("views", path.join(__dirname, "/views"))

app.get("/index.html", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

let dataFromFrontEnd = {};

let data = null

app.post("/submit", async (req, res) => {
    console.log('reqBody', req.body)
    dataFromFrontEnd = req.body

    data = JSON.stringify(dataFromFrontEnd);

    const pythonCaller = require("./pythonCaller");
    try {
        const result = await pythonCaller.callPython("backend.py", data);
    }
    catch (e) {
        console.log('e45', e)
    }
    console.log('await', result)
    result.then((e) => {
    }).catch((err) => {

        console.log('await', result)
    })


})

app.listen(5500, "127.0.0.1", function () {
    console.log("... port");
})