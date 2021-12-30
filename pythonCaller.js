const { spawn } = require('child_process');
const pythonDir = (__dirname + "backend.py"); // Path of python script folder
const python = pythonDir + "pythonEnv/bin/python"; // Path of the Python interpreter

/** remove warning that you don't care about */
function cleanWarning(error) {
    return error.replace(/Detector is not able to detect the language reliably.\n/g, "");
}

function callPython(scriptName, args) {
    return new Promise(function (success, reject) {
        const script = scriptName;
        const pyArgs = [script, JSON.stringify(args)]
        const pyprog = spawn("python", pyArgs);
        let result = "";
        let resultError = "";
        pyprog.stdout.on('data', function (data) {
            result += data.toString();
            console.log('got', result)
        });

        pyprog.stderr.on('data', (data) => {

            console.log('goterr', data)
            //resultError += cleanWarning(data.toString());
        });

        // pyprog.stdout.on("end", function () {
        //     if (resultError == "") {
        //         success(JSON.parse(result));
        //     } else {
        //         console.error(`Python error, you can reproduce the error with: \n${python} ${script} ${pyArgs.join(" ")}`);
        //         const error = new Error(resultError);
        //         console.error(error);
        //         reject(resultError);
        //     }
        // })
    });
}
module.exports.callPython = callPython;