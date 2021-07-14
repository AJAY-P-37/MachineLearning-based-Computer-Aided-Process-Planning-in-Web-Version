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
        backendProcessList.push(selected);
        inputProcessList.appendChild(tempList);
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
const enterButton = document.getElementById("enterbutton");

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
    if (inputProcessList.getElementsByTagName("li").length - 1 == dimensionsList.getElementsByTagName("li").length) {
        createNewListOfDimensions(diameter, length, offset, minDiameter);
        enterButton.disabled = true;
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
    const tempList = document.createElement("li");
    if (minDiameter == null) {
        tempDimList = [diameter, length, offset];
        tempList.innerHTML = `: Diameter=${diameter}, Length=${length}, Offset=${offset}`;
    } else {
        tempDimList = [diameter, minDiameter, length, offset];
        tempList.innerHTML = `: Major Diameter=${diameter}, Minor Diameter=${minDiameter}, Length=${length}, Offset=${offset}`;
        inputDia.placeholder = "Max Dia";
    }
    console.log(tempList)
    backendDimensionList.push(tempDimList);
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
    newInput.id = "dimensionNew";
    newInput.classList.add("form-control")
    inputDia.parentNode.insertBefore(newInput, inputLen);

    newInput.addEventListener("input", validateDimensions)
    newInput.addEventListener("invalid", showValidationMsg)
}