/**
 * 
 * @type HTMLCanvasElement
 */ 
const canvas = document.getElementById("drawingCanvas")
const guide = document.getElementById("guide")
const colorInput = document.getElementById("colorInput")
const toggleGuide = document.getElementById("toggleGuide")
const clearButton = document.getElementById("clearButton")

const drawingContext = canvas.getContext("2d")  // aka ctx

const CELL_SIDE_COUNT = 5
const cellPixelLength = canvas.width / CELL_SIDE_COUNT
const colorHistory = {}  // Tells us what colors were used for a given x/y coord

// Set the default color
colorInput.value = "#009578"

// Initialize the canvas background color
drawingContext.fillStyle = "rgba(0, 0, 0, 0)"
drawingContext.fillRect(0, 0, canvas.width, canvas.height)

var leftMouseDown = 0;

function onCanvasMouseDown(e) { 
    if(e.button == 0)
        leftMouseDown = 1;
}

function onWindowMouseUp(e){
    if(e.button == 0)
        leftMouseDown = 0;
}

function onWindowMouseLeave(e){
    leftMouseDown = 0;
}

function handleCanvasMousedown(e){

    // Ensure we're using the primary mouse button:
    if(leftMouseDown != 1)
        return;
    
    const canvasBoundingRect = canvas.getBoundingClientRect();

    // console.log(canvasBoundingRect)

    const x = e.clientX - canvasBoundingRect.left
    const y = e.clientY - canvasBoundingRect.top

    const cellX = Math.floor(x / cellPixelLength)
    const cellY = Math.floor(y / cellPixelLength)

    // console.log(`${x}, ${y}`)

    fillCell(cellX, cellY)
}

function handleClearButtonClick(){

    console.log(" == Old members:", colorHistory)

    const yes = confirm("Are you sure you wish to clear the canvas?")

    if(!yes)
        return

    drawingContext.clearRect(0, 0, canvas.width, canvas.height);

    // drawingContext.fillStyle = "rgba(0, 0, 0, 0)"
    // drawingContext.fillRect(0, 0, canvas.width, canvas.height)

    for (var member in colorHistory) delete colorHistory[member];

    console.log(" == New members:", colorHistory)
}

function handleToggleGuideChange(){


}

function fillCell(cellX, cellY){

    // X=0 and Y=0 is the top left corner
    // Positive values go right / downwards

    const startX = cellX * cellPixelLength
    const startY = cellY * cellPixelLength

    drawingContext.fillStyle = colorInput.value;
    drawingContext.fillRect(startX, startY, cellPixelLength, cellPixelLength)
    colorHistory[`${cellX}_${cellY}`] = colorInput.value
}

// Detects when left clicks are used inside the canvas 
canvas.addEventListener("mousedown", onCanvasMouseDown)
window.addEventListener("mouseup", onWindowMouseUp)
window.addEventListener("mouseleave", onWindowMouseLeave)
// -----------------

canvas.addEventListener("mousemove", handleCanvasMousedown)
clearButton.addEventListener("click", handleClearButtonClick)
toggleGuide.addEventListener("change", handleToggleGuideChange)
// toggleErase.addEventListener....
