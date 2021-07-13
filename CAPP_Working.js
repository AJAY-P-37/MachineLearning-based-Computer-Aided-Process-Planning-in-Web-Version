const inputProcessList = document.getElementById("processlist");
const inputProcess = document.getElementById("processes");

const dimensionsList = document.getElementById("dimensionslist");

let backendProcessList = [];
let backendDimensionList = [];

inputProcess.addEventListener("click", e => {
    inputProcess.value = null
})
inputProcess.addEventListener("change", (e) => {
    console.log(inputProcessList.getElementsByTagName("li").length, dimensionsList.getElementsByTagName("li").length)
    if (inputProcessList.getElementsByTagName("li").length == dimensionsList.getElementsByTagName("li").length) {
        const tempList = document.createElement("li");
        let selected = inputProcess.options[inputProcess.selectedIndex].value;
        if (selected == "Taper Turning") {
            addAnotherDimension();

        }
        else if (selected == "null") {
            return
        }
        else {
            removeDimension();
        }
        tempList.innerHTML = selected;
        inputProcessList.appendChild(tempList)
    }
    else {
        alert("Update The Dimensions for Previous Process")
    }
})


let diameter = 0, minDiameter = null, length = 0, offset = 0;
const inputDia = document.getElementById("dimensions1");
const inputLen = document.getElementById("dimensions2");
const inputOff = document.getElementById("dimensions3");

let newInput = null;
// function validateAllInputs() {
//     let validated = true;
//     for (let i of [inputDia, inputLen, inputOff]) {
//         i.addEventListener("input", e => {
//             i.setCustomValidity('');
//             if (i.checkValidity())
//                 validated = true;
//         })
//         i.addEventListener("invalid", (e) => {
//             i.setCustomValidity("Please Enter value Between 0 to 300");
//             validated = false;
//         })

//     }
//     if (inputDia.checkValidity()) {
//         validated = true;
//     }
//     inputDia.addEventListener("invalid", e => {
//         inputDia.setCustomValidity("Please Enter value Between 0 to 300")
//         validated = false;
//     })
//     if (newInput != null) {
//         if (newInput.checkValidity()) {
//             validated = true;
//         }
//         newInput.addEventListener("invalid", e => {
//             newInput.setCustomValidity("Please Enter value Between 0 to 300")
//             validated = false;
//         })
//     }
//     return validated;
// }

function validateAllInputs() {
    let validated = true;
    // inputDia.addEventListener("input", e => {
    //     validated = inputDia.checkValidity();
    // })
    // inputDia.addEventListener("invalid", (e) => {
    //     console.log("shit")
    // })
    // inputLen.addEventListener("input", e => {
    //     validated = inputLen.checkValidity();
    // })
    // inputLen.addEventListener("invalid", (e) => {
    //     console.log("shit")
    // })
    // inputOff.addEventListener("input", e => {
    //     validated = inputOff.checkValidity();
    // })
    // inputOff.addEventListener("invalid", (e) => {
    //     console.log("shit")
    // })
    if (inputDia.value == "" && inputDia < 0 && inputDia > 300) {
        validated = false;
    }
    return validated;
}
console.log(inputDia.oninput = validateAllInputs());
const enterButton = document.getElementById("enterbutton");
enterButton.disabled = inputDia.checkValidity() && inputLen.checkValidity() && inputOff.checkValidity();
enterButton.addEventListener("click", e => {

    if (validateAllInputs()) {
        diameter = inputDia.value;
        length = inputLen.value;
        offset = inputOff.value;
        if (newInput != null) {
            minDiameter = newInput.value;
        } else {
            minDiameter = null;
        }
        if (inputProcessList.getElementsByTagName("li").length - 1 == dimensionsList.getElementsByTagName("li").length) {
            createNewListOfDimensions(diameter, length, offset, minDiameter);
        } else {
            alert("Update the 'Process' for the Dimensions")
        }
    }
    enterButton.disabled = true;


})
document.addEventListener('keypress', function (e) {
    if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
    }

});

function createNewListOfDimensions(diameter, length, offset, minDiameter = null) {


    inputDia.placeholder = "Dia";

    const tempList = document.createElement("li");
    if (minDiameter == null) {
        tempList.innerHTML = `Diameter=${diameter}, Length=${length}, Offset=${offset}`;
    } else {
        tempList.innerHTML = `Major Diameter=${diameter}, Minor Diameter=${minDiameter}, Length=${length}, Offset=${offset}`;
        inputDia.placeholder = "Max Dia";
    }
    console.log(tempList)
    dimensionsList.appendChild(tempList);

    inputDia.value = "";

    inputLen.value = "";
    inputLen.placeholder = "Len";

    inputOff.value = "";
    inputOff.placeholder = "Offset";

    if (newInput != null) {
        newInput.value = "";
        newInput.placeholder = "Min Dia"
    }

}

function removeDimension() {
    if (newInput != null) {
        inputDia.parentNode.removeChild(newInput);
        inputDia.placeholder = "Dia";
    }
    newInput = null;
    minDiameter = null;
}

function addAnotherDimension() {
    newInput = document.createElement("input");
    newInput.type = "number";
    newInput.min = "0";
    newInput.max = "300";
    newInput.step = "0.01";
    inputDia.placeholder = "MaxDia";
    newInput.placeholder = "MinDia";
    newInput.classList.add("form-control")
    inputDia.parentNode.insertBefore(newInput, inputLen);

    newInput.addEventListener("input", e => {
        newInput.checkValidity();
    })
    newInput.addEventListener("invalid", e => {
        console.log("shit")
    })
}