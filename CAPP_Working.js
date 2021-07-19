const inputProcess = document.getElementById("processes");

const processList = document.getElementById("processlist");
const dimensionsList = document.getElementById("dimensionslist");
const inputList = document.getElementById("inputlist")

let backendProcessList = [];
let backendDimensionList = [];

inputProcess.addEventListener("change", (e) => {

    if (backendProcessList.length == backendDimensionList.length) {
        const tempList = document.createElement("option");
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
        backendProcessList.push(selected);
        inputList.size += 1;
        inputList.appendChild(tempList);
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
const enterButton = document.getElementById("enterbutton1");

const validateDimensions = function () {
    inputDia.setCustomValidity("");
    inputLen.setCustomValidity("");
    inputOff.setCustomValidity("");
    if (newInput != null) {
        newInput.setCustomValidity("");
        enterButton.disabled = !(inputDia.checkValidity() && inputLen.checkValidity() && inputOff.checkValidity() && newInput.checkValidity());

    } else {
        enterButton.disabled = !(inputDia.checkValidity() && inputLen.checkValidity() && inputOff.checkValidity());
    }
}
const showValidationMsg = function () {
    return "Please enter values between 0 and 300 with maximum of two decimal points";
}
inputDia.addEventListener("input", validateDimensions)
inputDia.addEventListener("invalid", () => inputDia.setCustomValidity(showValidationMsg))
inputLen.addEventListener("input", validateDimensions)
inputLen.addEventListener("invalid", () => inputLen.setCustomValidity(showValidationMsg))
inputOff.addEventListener("input", validateDimensions)
inputOff.addEventListener("invalid", () => inputOff.setCustomValidity(showValidationMsg))

enterButton.addEventListener("click", e => {
    diameter = inputDia.value;
    length = inputLen.value;
    offset = inputOff.value;
    if (newInput != null) {
        minDiameter = newInput.value;
    } else {
        minDiameter = null;
    }

    if (backendProcessList.length - 1 == backendDimensionList.length) {
        createNewListOfDimensions(diameter, length, offset, minDiameter);
        enterButton.disabled = true;
        inputProcess.value = null;
    } else {
        alert("Update the 'Process' for the Dimensions")
        return false;
    }
})
document.addEventListener('keypress', function (e) {
    if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
    }
});

function createNewListOfDimensions(diameter, length, offset, minDiameter = null) {
    inputDia.placeholder = "Dia";
    let tempDimList = []
    const tempList = document.createElement("option");
    if (minDiameter == null) {
        tempDimList = [diameter, length, offset];
        tempList.innerHTML += `: Diameter=${diameter}, Length=${length}, Offset=${offset}`;
    } else {
        tempDimList = [diameter, minDiameter, length, offset];
        tempList.innerHTML += `: Major Diameter=${diameter}, Minor Diameter=${minDiameter}, Length=${length}, Offset=${offset}`;
        inputDia.placeholder = "Max Dia";
    }

    backendDimensionList.push(tempDimList);
    inputList.options[inputList.size - 1].innerHTML += tempList.innerHTML;
    console.log(inputList.options[inputList.size - 1].innerHTML)

    inputDia.value = "";

    inputLen.value = "";
    inputLen.placeholder = "Len";

    inputOff.value = "";
    inputOff.placeholder = "Offset";

    if (newInput != null) {
        newInput.value = "";
        newInput.placeholder = "Min Dia"
        removeDimension();
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
    newInput.id = "dimensionNew";
    newInput.classList.add("form-control")
    inputDia.parentNode.insertBefore(newInput, inputLen);

    newInput.addEventListener("input", validateDimensions)
    newInput.addEventListener("invalid", showValidationMsg)
}

const deleteButton = document.getElementById("deletebutton");

deleteButton.addEventListener("click", e => {
    if (inputList.selectedIndex == -1) {
        alert("Select the item to be deleted");
    }
    else {
        while (inputList.selectedIndex != -1) {
            backendProcessList.splice(inputList.selectedIndex, 1);
            backendDimensionList.splice(inputList.selectedIndex, 1);
            inputList.removeChild(inputList.options[inputList.selectedIndex]);
            inputList.size -= 1;
        }
        inputProcess.value = null;
    }

})

const wpDia = document.getElementById("wpdimensions1");
const wpLen = document.getElementById("wpdimensions2");
const wpEnterButton = document.getElementById("enterbutton2");

const validateWpDimensions = function () {
    wpDia.setCustomValidity("");
    wpLen.setCustomValidity("");

    wpEnterButton.disabled = !(wpDia.checkValidity() && wpLen.checkValidity());
}
const showWpValidationMsg = function () {
    return "Please enter values between 0 and 300 with maximum of two decimal points";
}

wpDia.addEventListener("input", validateWpDimensions);
wpDia.addEventListener("invalid", () => wpDia.setCustomValidity(showWpValidationMsg));
wpLen.addEventListener("input", validateWpDimensions);
wpLen.addEventListener("invalid", () => wpLen.setCustomValidity(showWpValidationMsg));

const clearButton = document.getElementById("clearbutton");

clearButton.addEventListener("click", e => {

    backendProcessList = [];
    backendDimensionList = [];
    inputList.replaceChildren();
    // while (inputList.firstChild) {
    //     inputList.removeChild(inputList.lastChild);
    //     inputList.size -= 1;
    // }
    inputList.size = 0;
    inputProcess.value = null;
})