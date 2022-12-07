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

// Name of "cast lure" button ID
var buttonID = "cast_lure"

// Name of "open editor" button ID
var editorID = "open_editor"

// Get Global Objects
var lure = document.getElementById(lureID)
var viewport = document.getElementsByClassName(viewportClass)[0]
var startButton = document.getElementById(buttonID)
var editorButton = document.getElementById(editorID)


// Constant Variables
const gravity = 2;  // Used to be 1
const reelStrength = -2.3;  // Used to be -1

// The number of milliseconds between refreses. 
const UPDATETIMER = 10;

const fishValue = 100;

const speedMultiplier = 3;

const numberOfFishToSpawn = 75;

var currentScore = 0;

var FishHooked = false;

const VIEWPORTDIMENSIONS = {
    x: 1920,
    y: 1080
}

var castRange = 2000;

// Set Velocity of lure to gravity
var currentVelocity = { 
    y: gravity,
    x: reelStrength
};

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
    // Fish1 = {
    //     depth: 100, //y
    //     distance: 100, //x
    //     hooked: false, // If fish is affected by lure
    //     caught: false,  // Has fish been pulled to surface 
    //     fishIndex: 0 // The current fish index (used to grab elements)
    // },
]

var startCast = false;

var gameIsRunning = false;

var minHeight = 2000

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// METHODS ***************************
//      -Called before first update
function startGame()
{
    viewport.addEventListener("mousedown", function () {
        currentVelocity.y = reelStrength;
    })
    
    viewport.addEventListener("mouseup", function () {
        currentVelocity.y = gravity;
    })

    startButton.addEventListener("mousedown", function () {
        if (!gameIsRunning)
        {
            startCast = true;
        }
    })

    //create 20 fish
    for (let i = 0; i < numberOfFishToSpawn; i++) {
        fishSpawner(i);
    }

    // Begin Update Call
    update();
}

// Update Function
function update()
{
    if (fishs.length != numberOfFishToSpawn)
    {
        setTimeout(() => {
            update();
        }, UPDATETIMER);
        return;
    }
    if (startCast)
    {
        startCast = false;
        FishHooked = false;
        cast(castRange);
    }
    if (gameIsRunning)
    {
        updatePosition();
        
        checkIfReel();
    }
    updateScreenLocation();

    // Recursive call after UPDATETIMER
    // NOTE: setTimeout is an asynchronous function, code below it will run before update is called again. 
    setTimeout(() => {
        update();
    }, UPDATETIMER);
}

function checkIfReel()
{
    if (lurePos.x <= 0)
    {
        currentVelocity.x = 0;
        if (lurePos.y <= 0)
        {
            checkIfFishCaught()
            gameIsRunning = false;
        }
        else if (lurePos.y >= minHeight && currentVelocity.y >= gravity)
        {
            currentVelocity.y = 0;
        }
    } 
    else if ((lurePos.y <= 0 && currentVelocity.y != gravity) || (lurePos.y >= minHeight && currentVelocity.y >= gravity))
    {
        currentVelocity.y = 0;
    }
}

function checkIfFishCaught()
{
    fishs.forEach(function (fish, index) {
        if (fish.hooked)
        {
            currentScore += fishValue;
            fish.caught = true;
            fish.hooked = false;
        }
    })
}

function cast(castDistance)
{
    if (lurePos.x < castDistance)
    {
        if (castDistance - lurePos.x >= castDistance / 2)
        {
            lurePos.y -= gravity
        }
        else
        {
            lurePos.y += gravity + 1
        }
        
        lurePos.x -= reelStrength * 5

        setTimeout(() => {
            cast(castDistance);
        }, UPDATETIMER);
    }
    else
    {
        currentVelocity.y = gravity;
        currentVelocity.x = reelStrength;
        gameIsRunning = true;
    }
}

function updateScreenLocation()
{
    updateScreenValues();
    updateFishVisability();
}

// Update all positional values
function updatePosition()
{
    updatePositionValues();
}

// Update lure position
function updatePositionValues()
{
    if (FishHooked)
    {
        lurePos.y += currentVelocity.y * speedMultiplier;
        lurePos.x += currentVelocity.x * speedMultiplier;
    }
    else
    {
        lurePos.y += currentVelocity.y;
        lurePos.x += currentVelocity.x;
    }
}

function distanceToLure(x, y)
{
    return Math.sqrt(((x - lurePos.x) * (x - lurePos.x)) + ((y - lurePos.y) * (y - lurePos.y)));
}

function checkIfFishIsHooked(fish)
{
    var catchRadius = 50;
    if (!fish.caught && gameIsRunning && (distanceToLure(fish.distance, fish.depth) <= catchRadius))
    {
        FishHooked = true;
        return true;
    }
    return false;
}

// Update each fish location in viewport 
function updateFishVisability()
{
    fishs.forEach(function (fish, index) {
        var fishElement = document.getElementById(fishIDPrefix + fish.fishIndex);
        var stupidFishOffset = 0;
        for (var i = 0; i < index; i++)
        {
            if (!fishs[i].caught)
            {
                stupidFishOffset += 100;
            }
        }

        // Check if fish is being caught
        if (!fish.hooked && !FishHooked)
        {
            fish.hooked = checkIfFishIsHooked(fish)
        }
        // Check if fish is in veiwportBounds
        if (!fish.caught)
        {
            if (fish.hooked)
            {
                fishElement.style.top = lurePos.y - 50 + "px";
                fishElement.style.left = lurePos.x  - stupidFishOffset +  "px";
            }
            else
            {
                fishElement.style.top = fish.depth - 50 + "px";
                fishElement.style.left = fish.distance - stupidFishOffset + "px";
            }
            fishElement.classList.remove(hiddenClass)
        }
        else
        {
            fishElement.classList.add(hiddenClass);
        }
    })
}

async function getRandomImage() {
    let fishURL = null
    await fetch('http://localhost:3000/drawing/randomFish')
        .then(response => response.json())
        .then(data => {
            fishURL = data.imgURL
        })
        .catch(error => {
            console.log("Failed to grab image")
        });
    return fishURL
}
//Spawns one fish at a random location
async function fishSpawner(index) {
    let photoUrl = await getRandomImage()
    let ocean = document.getElementById("water")

    var personPhotoImg = document.createElement("img")
    personPhotoImg.classList.add("fish-img")
    personPhotoImg.src = photoUrl
    personPhotoImg.setAttribute("id","fish" + index);

    ocean.appendChild(personPhotoImg)

    const fishCoordinates = {distance: getRandomNumber(10, 2000), depth: getRandomNumber(10, 2000), hooked: false, caught: false, fishIndex: index} // TODO change to canvas size
    fishs.push(fishCoordinates)
}

// Set viewportBounds to be centered on lure position 
function updateScreenValues()
{
    viewportBounds.x.left = lurePos.x - (VIEWPORTDIMENSIONS.x / 2);
    viewportBounds.x.right = lurePos.x + (VIEWPORTDIMENSIONS.x / 2);
    viewportBounds.y.top = lurePos.y - (VIEWPORTDIMENSIONS.y / 2);
    viewportBounds.y.bottom = lurePos.y + (VIEWPORTDIMENSIONS.y / 2);

    viewport.style.top = -lurePos.y + "px";
    viewport.style.left = -lurePos.x + "px";
    lure.style.top = lurePos.y + "px";
    lure.style.left = lurePos.x + "px";

    var line = document.getElementById("line")
    line.x2.baseVal.value = lurePos.x + 30
    line.y2.baseVal.value = lurePos.y + 190
    
}



startGame();




// ***********************
// FISH EDITOR MODAL STUFF
// ***********************

// var modal = document.getElementById("fishEditor");
// var span = document.getElementsByClassName("closeEditor")[0];


// // When the user clicks on the button, open the modal
// editorButton.onclick = function() {
//   modal.style.display = "block";
// }

// // When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }