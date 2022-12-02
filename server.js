


var express = require('express')
var exphbs = require('express-handlebars');


var app = express()
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs.engine({
  defaultLayout: null  // 'main'
}))
app.set('view engine', 'handlebars')

app.use(express.static('public'))

// app.get('/about', function (req, res, next) {
//     console.log('== Request received')
//     console.log('  -- req.url:', req.url)
//     console.log('  -- req.method:', req.method)
//     res.status(200).sendFile(__dirname + '/public/about.html')
// })

app.get('*', function (req, res, next) {
    console.log('== Request received')
    console.log('  -- req.url:', req.url)
    console.log('  -- req.method:', req.method)
    
    res.status(404).render('404');
})





// app.get('/', function (req, res, next) {
//   res.status(200).render('', {})
// })

// app.get('*', function (req, res, next) {
//   res.status(404).render('404')
// });


app.listen(port, function () {
    console.log('== Server is listening on port:', port)
})
