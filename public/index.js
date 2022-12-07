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

var fishFiles = [
    path1={
    path: "./userImages/gold.png"
    },
    path2={
    path: "https://clipground.com/images/cooked-fish-clipart-png-18.png"
    },
    path3={
    path: "https://creazilla-store.fra1.digitaloceanspaces.com/cliparts/59168/fish-clipart-md.png"
    },
    path4={
    path: "./userImages/derp.png"
}
]

// Name of lure class
var lureID = "object"

// Name of viewport class (This could also be an ID)
var viewportClass = "gameviewer"

// Name of button id
var buttonID = "button"

// Get Global Objects
var lure = document.getElementById(lureID)
var viewport = document.getElementsByClassName(viewportClass)[0]
var startButton = document.getElementById(buttonID)

// Constant Variables
const gravity = 1;
const reelStrength = -1;

// The number of milliseconds between refreses. 
const UPDATETIMER = 10;

const VIEWPORTDIMENSIONS = {
    x: 1920,
    y: 1080
}

var castRange = 1000;

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
    //     distance: 100 //x
    // },
]

var startCast = false;

var gameIsRunning = false;

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
        startCast = true;
    })

    //create 20 fish
    for (let i = 0; i < 20; i++) {
        fishSpawner(i);
    }

    // Begin Update Call
    update();
}

// Update Function
function update()
{
    console.log(gameIsRunning)
    
    if (startCast)
    {
        startCast = false;
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
            gameIsRunning = false;
        }
    }
    
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
    lurePos.y += currentVelocity.y;
    lurePos.x += currentVelocity.x;
}

// Update each fish location in viewport 
function updateFishVisability()
{
    fishs.forEach(function (fish, index) {
        var fishElement = document.getElementById(fishIDPrefix + index);
        // Check if fish is in veiwportBounds
        if ((fish.depth < viewportBounds.y.bottom && fish.depth > viewportBounds.y.top) && (fish.distance < viewportBounds.x.right && fish.distance > viewportBounds.x.left))
        {
            fishElement.style.top = fish.depth + "px";
            fishElement.style.left = fish.distance + "px";
            fishElement.classList.remove(hiddenClass)
        }
        else
        {
            fishElement.classList.add(hiddenClass);
        }
    })
}

function getRandomImage() {
    console.log(fishFiles)
    return fishFiles[Math.floor(Math.random() * (fishFiles.length))].path
}
//Spawns one fish at a random location
function fishSpawner(index) {
    let photoUrl = getRandomImage()
    let ocean = document.getElementById("water")


    var personPhotoImg = document.createElement("img")
    personPhotoImg.classList.add("fish-img")
    personPhotoImg.src = photoUrl
    personPhotoImg.setAttribute("id","fish" + index);


    ocean.appendChild(personPhotoImg)

    const fishCoordinates = {distance: getRandomNumber(10, 500), depth: getRandomNumber(10, 500)} // TODO change to canvas size
    fishs.push(fishCoordinates)
    console.log(fishs)

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
    lure.style.top = lurePos.y + (VIEWPORTDIMENSIONS.y / 2) + "px";
    lure.style.left = lurePos.x + (VIEWPORTDIMENSIONS.x / 2) + "px";
}




startGame();