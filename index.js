const express = require("express")
const ejsMate = require('ejs-mate')
const path = require("path")

const app = express()
// app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(express.static(__dirname));
app.engine('ejs', ejsMate);
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "/views"))

let result = null
app.get("/dragDropList", (req, res) => {
    res.render('dragDropList', { result })
    result = null;
})

let dataFromFrontEnd = {};

let data = null


app.post("/submit", async (req, res) => {
    dataFromFrontEnd = req.body

    //dataFromFrontEnd = JSON.stringify(dataFromFrontEnd);

    console.log('json', dataFromFrontEnd)

    const pythonCaller = require("./pythonCaller");
    result = await pythonCaller.callPython("backend.py", dataFromFrontEnd);
    result = JSON.parse(result)
    console.log('await', result)

    res.redirect('dragDropList')

})

app.listen(5500, "127.0.0.1", function () {
    console.log("... port");
})