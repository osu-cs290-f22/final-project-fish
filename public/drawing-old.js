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

const drawingContext = canvas.getContext("2d")  // aka ctx

const CELL_SIDE_COUNT = 100
const cellPixelLength = canvas.width / CELL_SIDE_COUNT
const colorHistory = {}  // Tells us what colors were used for a given x/y coord
//


// Set the default color
colorInput.value = "#009578"

// Initialize the canvas background color
drawingContext.fillStyle = "rgba(0, 0, 0, 0)"
drawingContext.fillRect(0, 0, canvas.width, canvas.height)
//

// Setup the guide
guide.style.width = `${canvas.width}px`
guide.style.height = `${canvas.height}px`
guide.style.gridTemplateColumns = `repeat(${CELL_SIDE_COUNT}, 1fr)`
guide.style.gridTemplateRows = `repeat(${CELL_SIDE_COUNT}, 1fr)`;

[...Array(CELL_SIDE_COUNT ** 2)].forEach(() => guide.insertAdjacentHTML("beforeend", "<div></div>"))
//


// Determine mouse states:
var leftMouseDown = 0
var ctrlDown = 0

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

            clearCell(cellX, cellY)
        
        }else{

            fillCell(cellX, cellY)
        }
    }
}

function handleClearButtonClick(){

    console.log(" == Old members:", colorHistory)

    const yes = confirm("Are you sure you wish to clear the canvas?")

    if(!yes)
        return

    drawingContext.clearRect(0, 0, canvas.width, canvas.height)

    // drawingContext.fillStyle = "rgba(0, 0, 0, 0)"
    // drawingContext.fillRect(0, 0, canvas.width, canvas.height)

    for (var member in colorHistory) delete colorHistory[member]

    console.log(" == New members:", colorHistory)
}

function handleToggleGuideChange(){

    guide.style.display = toggleGuide.checked ? null : "none"
}

function fillCell(cellX, cellY){

    console.log("Drawing!")

    // X=0 and Y=0 is the top left corner
    // Positive values go right / downwards

    const startX = cellX * cellPixelLength
    const startY = cellY * cellPixelLength

    drawingContext.fillStyle = colorInput.value;
    drawingContext.fillRect(startX, startY, cellPixelLength, cellPixelLength)
    colorHistory[`${cellX}_${cellY}`] = colorInput.value
}

function clearCell(cellX, cellY){

    // X=0 and Y=0 is the top left corner
    // Positive values go right / downwards

    const startX = cellX * cellPixelLength
    const startY = cellY * cellPixelLength

    // Clear it
    drawingContext.clearRect(startX, startY, cellPixelLength, cellPixelLength)
    
    // Remove from color history
    if(`${cellX}_${cellY}` in colorHistory)
        delete colorHistory[`${cellX}_${cellY}`]
}
//


// Detects when left clicks are used inside the canvas 
canvas.addEventListener("mousedown", onCanvasMouseDown)
window.addEventListener("mouseup", onWindowMouseUp)
window.addEventListener("mouseleave", onWindowMouseLeave)
// -----------------

// Other event listeners
canvas.addEventListener("mousemove", canvasMouseActive)
clearButton.addEventListener("click", handleClearButtonClick)
toggleGuide.addEventListener("change", handleToggleGuideChange)
