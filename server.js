var express = require('express')
var exphbs = require('express-handlebars');

var fishData = require('./public/userImages/fishData.json')
var fs = require("fs");
const e = require('express');


var app = express()
var port = process.env.PORT || 3000;


var pastUsers = []  // Used to check who to show the modal to


function getRandomImage() {
    return fishData[Math.floor(Math.random() * (fishData.length))]
}

function getRandomFishURI() {
    return fishData[Math.floor(Math.random() * (fishData.length))].imgURL
}



app.engine('handlebars', exphbs.engine({
  defaultLayout: null  // 'main'
}))
app.set('view engine', 'handlebars')

app.use(express.json())  

app.use(express.static('public'))


// Note that this user is not new
app.get("*", function(req, res, next){

    if(!pastUsers.includes(req.user)){
        pastUsers.push(req.user)
    }
    next()
})


app.get(['/', '/game'], function (req, res, next) {

    var isFirstTime

    if(req.user in pastUsers)
        isFirstTime = false
    else   
        isFirstTime = true

    res.status(200).render("home", {

        firstTime: isFirstTime,
        headerFishImgURL: getRandomFishURI()
    })
})


app.get('/return', function(req, res, next){

    res.status(200).render("home", {

        "firstTime": false,
        headerFishImgURL: getRandomFishURI()
    })
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

app.get('/drawing/randomFish', (req, res) => {
    res.json(getRandomImage());
});

app.post('/drawing/newFish', function(req, res, next){

    if(req.body && req.body.imgURL && req.body.birthday && req.body.name && req.body.description && req.body.favMovie){

        // Catch any people posting unfiltered data
        if(req.body.name.includes('>') || req.body.name.includes('<') || req.body.description.includes('>') ||
            req.body.description.includes('<') || req.body.favMovie.includes('>') || req.body.favMovie.includes('<')){

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
        res.status(400).send(`Request didn\'t have all necessary fish components. LAME! ${req.body}`)
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