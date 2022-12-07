

/**
 * 
 * @type HTMLCanvasElement
 */ 
const canvas = document.getElementById("drawingCanvas")
const guide = document.getElementById("guide")
const colorInput = document.getElementById("colorInput")
const toggleGuide = document.getElementById("toggleGuide")
const clearButton = document.getElementById("clearButton")
const toggleErase = document.getElementById("toggleErase") 
const exportButton = document.getElementById("exportButton")

const strokeRange = document.getElementById("strokeRange")
const strokeLabel = document.getElementById("strokeLabel")

const drawingContext = canvas.getContext("2d")  // aka ctx

const CELL_SIDE_COUNT = 100
const cellPixelLength = canvas.width / CELL_SIDE_COUNT

// colorHistory: The javascript object that stores picture data
        // Tells us what colors were used for a given x/y coord. In format "{posx}_{posy}": "{color}"
        // Position starts from top left, positive y-axis is downwards and positive x-axis is to the right
        // Transparent cells (or erased cells) aren't listed in this object
const colorHistory = {}  
//


// Set the default color
colorInput.value = "#009578"

// Initialize the canvas background color
drawingContext.fillStyle = "rgba(0, 0, 0, 0)"
drawingContext.fillRect(0, 0, canvas.width, canvas.height)
//

// Setup the pixel grid guide
guide.style.width = `${canvas.width}px`
guide.style.height = `${canvas.height}px`
guide.style.gridTemplateColumns = `repeat(${CELL_SIDE_COUNT}, 1fr)`
guide.style.gridTemplateRows = `repeat(${CELL_SIDE_COUNT}, 1fr)`;

[...Array(CELL_SIDE_COUNT ** 2)].forEach(() => guide.insertAdjacentHTML("beforeend", "<div></div>"))
//


var strokeWidth = 5
var leftMouseDown = 0
var ctrlDown = 0


// Functions for determining mouse state
function onCanvasMouseDown(e) { 
    
    if(e.ctrlKey)
        ctrlDown = 1

    if(e.button == 0){
        leftMouseDown = 1
        canvasMouseActive(e)
    }
}

function onWindowMouseUp(e){
    leftMouseDown = 0
    ctrlDown = 0
}

function onWindowMouseLeave(e){
    leftMouseDown = 0;
    ctrlDown = 0
}
//


// Functions used to change pixel values on the canvas:
function canvasMouseActive(e){

    // Ensure we're using the primary mouse button:
    if(leftMouseDown != 1)
        return;
    
    const canvasBoundingRect = canvas.getBoundingClientRect();

    // Calculate the cells we're inside
    const x = e.clientX - canvasBoundingRect.left
    const y = e.clientY - canvasBoundingRect.top
    const cellX = Math.floor(x / cellPixelLength)
    const cellY = Math.floor(y / cellPixelLength)

    // If control key is down, get current cell color
    if(ctrlDown){
        const currentColor = colorHistory[`${cellX}_${cellY}`]

        if(currentColor){
            colorInput.value = currentColor
        }
     
    // OTHERWISE, fill/erase the cell
    }else{

        if(toggleErase.checked){

            editAtCenter(cellX, cellY, eraseCell)
        
        }else{

            editAtCenter(cellX, cellY, fillCell)
        }
    }
}


function handleClearButtonClick(){

    const yes = confirm("Are you sure you wish to clear the canvas?")

    if(!yes)
        return

    drawingContext.clearRect(0, 0, canvas.width, canvas.height)

    // drawingContext.fillStyle = "rgba(0, 0, 0, 0)"
    // drawingContext.fillRect(0, 0, canvas.width, canvas.height)

    for (var member in colorHistory) delete colorHistory[member]
}


function handleToggleGuideChange(){

    guide.style.display = toggleGuide.checked ? "grid" : "none"
    console.log(" == guide.style.display:", guide.style.display)
}


function spiralAround(centerX, centerY, magnitude, cellAction){

    var x

    // Left to top
    for(x = -magnitude; x < 0; x++){

        cellAction(centerX + x, centerY + (-magnitude - x))
    }

    // Top to right
    for(x = 0; x < magnitude; x++){

        cellAction(centerX + x, centerY + (-magnitude + x))
    }

    // Right to bottom
    for(x = magnitude; x > 0; x--){

        cellAction(centerX + x, centerY + (magnitude - x))
    }

    // Bottom to left
    for(x = 0; x > -magnitude; x--){

        cellAction(centerX + x, centerY + (magnitude + x))
    }
}


function editAtCenter(centerX, centerY, cellAction){

    // Fill just at center
    cellAction(centerX, centerY)
    
    // Spirals the center around filling more, if the stroke is bigger
    if(strokeWidth != 1){

        var distance
        for(distance = 1; distance <= (strokeWidth + 1) / 2; distance++)
            spiralAround(centerX, centerY, distance, cellAction)
    }
}


function fillCell(cellX, cellY){

    // X=0 and Y=0 is the top left corner
    // Positive values go right / downwards

    if(cellX < 0 || cellX >= CELL_SIDE_COUNT || cellY < 0 || cellY >= CELL_SIDE_COUNT)
        return

    const startX = cellX * cellPixelLength
    const startY = cellY * cellPixelLength

    drawingContext.fillStyle = colorInput.value;
    drawingContext.fillRect(startX, startY, cellPixelLength, cellPixelLength)
    colorHistory[`${cellX}_${cellY}`] = colorInput.value
}


function eraseCell(cellX, cellY){

    // X=0 and Y=0 is the top left corner
    // Positive values go right / downwards

    if(cellX < 0 || cellX >= CELL_SIDE_COUNT || cellY < 0 || cellY >= CELL_SIDE_COUNT)
        return

    const startX = cellX * cellPixelLength
    const startY = cellY * cellPixelLength

    // Clear it
    drawingContext.clearRect(startX, startY, cellPixelLength, cellPixelLength)
    
    // Remove from color history
    if(`${cellX}_${cellY}` in colorHistory)
        delete colorHistory[`${cellX}_${cellY}`]
}


function updateStrokeRangeUI(){

    strokeLabel.textContent = `Stroke ${strokeRange.value}`
}


function changeStroke(){

    strokeWidth = parseInt(strokeRange.value)
    console.log(" == New stroke Width:", strokeWidth)
}


function makeInputsReadOnly(){

    console.log("TODO: Make inputs read-only")
}


function makeInputsWriteable(){

    console.log("TODO: Make inputs writeable-only")
}



function exportData() {

    makeInputsReadOnly()

    // Create the data object
    var fish_data = {}

    fish_data["imgURL"] = canvas.toDataURL("image/png")

    fish_data["birthday"] = document.getElementById("fishBirthday").value

    const fishName = document.getElementById("fishName").value.replace("<", "").replace(">", "")
    fish_data["name"] = fishName

    const fishDescription = document.getElementById("fishBio").value.replace("<", "").replace(">", "")
    fish_data["description"] = fishDescription

    const favoriteMovie = document.getElementById("fishMovie").value.replace("<", "").replace(">", "")
    fish_data["favMovie"] = favoriteMovie

    if(!fish_data["name"] || !fish_data["birthday"] || !fish_data["description"] || !fish_data["favMovie"]){

        alert("Please enter in all of the fish data. OR ELSE.")
        return
    }

    // Post the object to the server and quit
        // If there's an error, tell the user and make inputs writeable again
    exportAndQuit(fish_data)
}


function exportAndQuit(fish_data){

    var reqUrl = "/drawing/newFish"

    console.log(" == fish_data:", fish_data)

    // Fetch is used to send http requests through js
    fetch(reqUrl, {

      // Default request is get, but we want it to be a post request
      method: "POST",
      body: JSON.stringify(fish_data),
      headers: {
        "Content-Type": "application/json"
      }

    }).then(function(res){

        // SUCCESS
        if(res.status === 200){

            // Tell the user their fish was uploaded and continue
            alert("Your fish was successfully uploaded!")
        
        // FAIL
        }else{

            alert("An error occured--this fish was not saved: " + res.status)
            makeInputsReadOnly()
        }

    // ERROR
    }).catch(function (err){

      alert("An error occured--this fish was not saved: " + err)
      makeInputsReadOnly()
    })
}





// Detects when left clicks are used inside the canvas 
canvas.addEventListener("mousedown", onCanvasMouseDown)
window.addEventListener("mouseup", onWindowMouseUp)
window.addEventListener("mouseleave", onWindowMouseLeave)
// 

// Detects changes to drawing modes
canvas.addEventListener("mousemove", canvasMouseActive)
clearButton.addEventListener("click", handleClearButtonClick)
toggleGuide.addEventListener("change", handleToggleGuideChange)
strokeRange.addEventListener("change", changeStroke)
strokeRange.addEventListener("input", updateStrokeRangeUI)
//

// Exporting!
exportButton.addEventListener("click", exportData)
