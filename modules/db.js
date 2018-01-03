var async = require('async');
var MongoClient = require('mongodb').MongoClient;

module.exports = class DB {
    constructor(url) {
        this.url = url;
        console.log(url);
    }
  
    getPictures(){
        console.log("Getting pictures...");
        console.log(this.url);
        dbop(this.url, []);
    }

    
    
};

function dbop(url, tasks){

    var tsk = [
    function(cb){   //mongodb connection
        console.log("Opening database connection...");
        MongoClient.connect(url, {poolSize: 100}, function(err, dbase){
            if (err) return cb(err);
            console.log("Connected to database.");
            db = dbase;
            lab = db.db('lab10');
            cb(null);
        });
    }];

    var endcap = function (err, results) {
        if (err) {
            console.log("Error: ");
            console.log(err);
        } else {
            console.log("All went well.");
        }
        console.log("Closing database connection...");
        db.close();
    };

    tsk = tsk.concat(tasks);

    console.log(tsk);

    async.waterfall(tsk, endcap);
}