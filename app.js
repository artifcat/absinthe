//Packages
var express = require('express');

//Constants
const port = 3000;

//Variables
var app = express();

app.set('view engine', 'pug');


app.get("/", function(req, res){
    res.render('index', { title: 'Hey', message: 'Hello there!' })
});

app.listen(port, function(){
    console.log("Server listening on port " + port);
});