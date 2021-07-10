const inputProcessList = document.getElementById("processlist");
const inputProcess = document.getElementById("processes");

const dimensionsList = document.getElementById("dimensionslist");

let backendProcessList = [];
let backendDimensionList = [];

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
        tempList.innerHTML = selected;
        inputProcessList.appendChild(tempList)
    }
    else {
        alert("Update The Dimensions for Previous Process")
    }
})

function createNewListOfDimensions(diameter, length, offset, minDiameter = null) {
    const tempList = document.createElement("li");
    if (minDiameter == null) {
        tempList.innerHTML = `Diameter=${diameter}, Length=${length}, Offset=${offset}`;
    } else {
        tempList.innerHTML = `Major Diameter${diameter}, Minor Diameter${minDiameter}, Length${length}, Offset${offset}`;
    }
    dimensionsList.appendChild(tempList)

}

let diameter = 0, minDiameter = null, length = 0, offset = 0;
const inputDia = document.getElementById("dimensions1");
inputDia.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
        diameter = inputDia.value
        console.log(diameter)
    }
})
const inputLen = document.getElementById("dimensions2");
inputLen.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
        length = inputLen.value
        console.log(length)
    }
})
const inputOff = document.getElementById("dimensions3");
inputOff.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
        offset = inputOff.value
        console.log(offset)
        if (inputProcessList.getElementsByTagName("li").length - 1 == dimensionsList.getElementsByTagName("li").length) {
            createNewListOfDimensions(diameter, length, offset, minDiameter);
        } else {
            alert("Update the 'Process' for the Dimensions")
        }
    }

})

function addAnotherDimension() {
    let newInput = document.createElement("input");
    newInput.type = "number";
    newInput.min = "0";
    newInput.max = "300";
    inputDia.placeholder = "MaxDia";
    newInput.placeholder = "MinDia";
    console.log(inputDia.parentNode)
    inputDia.parentNode.insertBefore(newInput, inputLen);

    newInput.addEventListener("keyup", (e) => {
        if (e.key == "Enter") {
            minDiameter = newInput.value
            console.log(minDiameter)
        }
    })
}