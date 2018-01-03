//Packages
var express = require('express');

//Constants
const port = 3000;

//Variables
var app = express();

//  test
var data = [
    {
        name: 'Mana',
        color: 'black',
        weight: 3.7
    },
    {
        name: 'Snowball',
        color: 'white',
        weight: 2.8
    },
    {
        name: 'Sir Puffington',
        color: 'brown',
        weight: 5.2
    }
];
// /test

//static linking
app.use('/js', express.static(__dirname + '/public/js'));

app.set('view engine', 'pug');


app.get("/", function(req, res){
    res.render('index', { title: 'Hey', message: 'Hello there!', data: JSON.stringify(data)});
});

app.listen(port, function(){
    console.log("Server listening on port " + port);
});