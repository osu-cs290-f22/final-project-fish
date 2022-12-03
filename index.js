/* 
 *  UPDATE CSS NAMES HERE
 */

// Name of class which hides object from screen
var hiddenClass = "hidden"

/* Name of ID which is added to fish
 *  IE: <div id="fish0" class = "fish"></div>
 *  where the fishIDPrefix is "fish"
 */
var fishIDPrefix = "fish" 

// Name of lure class
var lureID = "object"

// Name of viewport class (This could also be an ID)
var viewportClass = "gameviewer"

// Get Global Objects
var lure = document.getElementById(lureID)
var viewport = document.getElementsByClassName(viewportClass)[0]

// Constant Variables
const gravity = 1;
const reelStrength = -1;

// The number of milliseconds between refreses. 
const UPDATETIMER = 10;

const VIEWPORTDIMENSIONS = {
    x: 600,
    y: 400
}

// Set Velocity of lure to gravity
var currentVelocity = gravity;

// Lure positon in world
var lurePos = {
    x: 0,
    y: 0
}

// Auto set to viewport dimensions centered at lure positon 
var viewportBounds = {
    x: {
        left: 0,
        right: 400
    },
    y: {
        top: 0,
        bottom: 600
    }
}

// IMPORT FISH HERE
var fishs = [
    Fish1 = {
        depth: 100,
        distance: 100
    },
    Fish2 = {
        depth: 600,
        distance: 400
    },
    Fish3 = {
        depth: 100,
        distance: 50
    },
]


// METHODS ***************************
//      -Called before first update
function start()
{
    viewport.addEventListener("mousedown", function () {
        currentVelocity = reelStrength
    })
    
    viewport.addEventListener("mouseup", function () {
        currentVelocity = gravity
    })

    // Begin Update Call
    update();
}

// Update Function
function update()
{
    updatePosition();
    
    // Recursive call after UPDATETIMER
    // NOTE: setTimeout is an asynchronous function, code below it will run before update is called again. 
    setTimeout(() => {
        update();
    }, UPDATETIMER);
}

// Update all positional values
function updatePosition()
{
    updatePositionValues();
    updateScreenValues();
    updateFishLocations();
}

// Update lure position
function updatePositionValues()
{
    lurePos.y += currentVelocity;
    lurePos.x += 0;
}

// Update each fish location in viewport 
function updateFishLocations()
{
    fishs.forEach(function (fish, index) {
        var fishElement = document.getElementById(fishIDPrefix + index);
        // Check if fish is in veiwportBounds
        if ((fish.depth < viewportBounds.y.bottom && fish.depth > viewportBounds.y.top) && (fish.distance < viewportBounds.x.right && fish.distance > viewportBounds.x.left))
        {
            fishElement.classList.remove(hiddenClass)
            fishElement.style.top = fish.depth - viewportBounds.y.top  - 60 + "px";
            fishElement.style.left = fish.distance - viewportBounds.x.left + "px";
        }
        else
        {
            fishElement.classList.add(hiddenClass)
        }
    })
}

// Set viewportBounds to be centered on lure position 
function updateScreenValues()
{
    viewportBounds.x.left = lurePos.x - (VIEWPORTDIMENSIONS.x / 2);
    viewportBounds.x.right = lurePos.x + (VIEWPORTDIMENSIONS.x / 2);
    viewportBounds.y.top = lurePos.y - (VIEWPORTDIMENSIONS.y / 2);
    viewportBounds.y.bottom = lurePos.y + (VIEWPORTDIMENSIONS.y / 2);
}






// START CALL
start();