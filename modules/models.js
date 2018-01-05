var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var passportLocalMongoose = require('passport-local-mongoose');

module.exports = function(mongoose) {
    var User = new Schema({
        email               :   String,
    });
    var Image = new Schema({
        filename            :   {type: String, index: true},
        id                  :   ObjectId,
        thumbnail           :   String,
        uploader            :   {type: ObjectId, ref: User}
    });

    User.plugin(passportLocalMongoose);

    var models = {
      User  : mongoose.model('Users', User),
      Image : mongoose.model('Images', Image),
    };

    //console.log(User);

    return models;
}