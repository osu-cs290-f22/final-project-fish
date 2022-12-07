var express = require('express')
var exphbs = require('express-handlebars');

var fishData = require('./public/userImages/fishData.json')
var fs = require("fs");
const path = require("path");


var app = express()
var port = process.env.PORT || 3000;

var listOfFishImages = fs.readdirSync(path.join(__dirname + "/public"+"/userImages"))

function getRandomImage() {
    console.log(listOfFishImages)
    return listOfFishImages[Math.floor(Math.random() * (listOfFishImages.length))]
}

app.engine('handlebars', exphbs.engine({
  defaultLayout: null  // 'main'
}))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/game', function (req, res, next) {
    console.log('== Request received')
    console.log('  -- req.url:', req.url)
    console.log('  -- req.method:', req.method)

    res.status(200).sendFile(__dirname + '/public/index2.html')
})

app.get('/editor', function (req, res, next) {
    console.log('== Request received')
    console.log('  -- req.url:', req.url)
    console.log('  -- req.method:', req.method)

    res.status(200).sendFile(__dirname + '/public/drawingPrototype/drawing.html')
})

app.get('/about', function (req, res, next) {
    console.log('== Request received')
    console.log('  -- req.url:', req.url)
    console.log('  -- req.method:', req.method)
    res.status(200).sendFile(__dirname + '/public/about.html')
})

app.post('/drawing/newFish', function(req, res, next){

    if(req.body && req.body.imgURL && req.body.birthday && req.body.name && req.body.description && req.body.favMovie){

        // Catch any people posting unfiltered data
        if(req.body.name.contains('>') || req.body.name.contains('<') || req.body.description.contains('>') ||
            req.body.description.contains('<') || req.body.favMovie.contains('>') || req.body.favMovie.contains('<')){

                res.status(400).send('Possibly dangerous fish data was rejected.')
                return
            }

        var newFishObj = {

            'imgURL': req.body.imgURL,
            'birthday': req.body.birthday,
            'name': req.body.name,
            'description': req.body.description,
            'favMovie': req.body.favMovie
        }

        fishData.push(newFishObj)

        fs.writeFile(
            './public/userImages/fishData.json', 
            JSON.stringify(fishData, null, 2),  // Null and 2 are to make it pretty
            function(err, ){
    
              // Since this is asynchronous, we need to make a callback to run after it's done
              if(err){
    
                res.status(500).send('Error writing photo to database')
    
              }else{
    
                res.status(200).send('Photo successfully added.')
              }
        })
    
    // Otherwise, the posted object does NOT match the specs
    }else{

        // Give the client a signal that they didn't give us all we needed
        res.status(400).send('Request didn\'t have all necessary fish components. LAME!')
    }
})

app.get('*', function (req, res, next) {
    console.log('== Request received')
    console.log('  -- req.url:', req.url)
    console.log('  -- req.method:', req.method)
    
    res.status(404).render('404');
})

app.listen(port, function () {
    console.log('== Server is listening on port:', port)
})
console.log(fishData[1])
const newFish = {"imgURL": "data:image/png;base64,iVBORw0KG...(this is just an example, it can be plugged into img.src",
    "birthday": "",
    "name": "Examasdfkjhaskjdfbhkjasdnfple Fish",
    "description": "This fish is super cool",
    "favMovie": "Finding Nemo"}

fishData.push(newFish)
fishData.push(newFish)

fs.writeFile(
    './public/userImages/fishData.json',
    JSON.stringify(fishData, null, 2),
    function (err) {
        if (err) {
            // res.status(500).send("Error writing photo to DB")
            console.log("you fucked up")
        } else {
            // res.status(200).send("Photo successfully added!!!!!")
            console.log("you didnt fuck up")
        }
    }
)
// fishData.fish.push("bana");
// console.log(fishData)
console.log(fishData)
console.log(getRandomImage())