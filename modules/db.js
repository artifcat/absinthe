var async = require('async');
var MongoClient = require('mongodb').MongoClient;

var dbobj;
var db;

module.exports = class DB {
    constructor(url) {
        this.url = url;
        console.log(url);
    }
  
    getImages(tags=[], callback){
        console.log("Getting pictures...");
        dbop(this.url, [selectImage()], callback);

    }

    addImage(img){
        dbop(this.url, [insertImage(img)]);
    }

    getTags(){

    }

    test(tag){
        dbop(this.url, [insertTag(tag)]);
    }
    
    
};

//Models
module.exports.Tag = class Tag {
    constructor(name){
        this.name = name;
        this.pictureCount = 0;
    }
}

module.exports.Image = class Image {
    constructor(filename, tags, user, sourceurl = ''){
        this.filename = filename;
        this.tags = tags;
        this.uploader = user;
        this.source = sourceurl;
        //todo this.thumbnail
    }
}

//Functions

function dbop(url, tasks, callback){
    var tsk = [
    function(cb){   //mongodb connection
        console.log("Opening database connection...");
        MongoClient.connect(url, {poolSize: 100}, function(err, dbase){
            if (err) return cb(err);
            console.log("Connected to database.");
            dbobj = dbase;
            db = dbobj.db('absinthe');
            cb(null);
        });
    }];

    var cb = function (err, results) {
        if (err) {
            console.log("Error: ");
            console.log(err);
        } else {
            if(callback)
                callback(results);
            console.log("All went well.");
        }
        console.log("Closing database connection...");
        dbobj.close();
    };

    tsk = tsk.concat(tasks);

    async.waterfall(tsk, cb);
}

function insertTag(tag){

    var newTag = new Tag(tag);

    return function(cb){
        db.collection("tags").createIndex({name: 1}, {unique: true});
        db.collection("tags").insert({name: newTag.name}, newTag, cb);
    }
}

function selectImage(tags = []){
    //todo: implement filtering by tags
    return function(cb){
        var cursor = db.collection("images").find();
        cursor.toArray(cb);
    }
}

function insertImage(picture){
    return function(cb){
        db.collection("images").insert(picture, cb);
    }
}