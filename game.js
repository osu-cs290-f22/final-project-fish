var fs = require("fs")
var path = require("path")

/*
Global Variables
*/
var listOfFishImages


/*
Setup Functions
*/
listOfFishImages = fs.readdirSync(path.join(__dirname + "/public"+"/userImages"))
//TODO handle non image files


/*
Runtime Functions
*/
function getRandomImage() {
    return listOfFishImages[Math.floor(Math.random() * (listOfFishImages.length))]
}

console.log(getRandomImage())
console.log(getRandomImage())
console.log(getRandomImage())
console.log(getRandomImage())
console.log(getRandomImage())
console.log(getRandomImage())
console.log(getRandomImage())

