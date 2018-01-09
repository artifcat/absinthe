var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var passportLocalMongoose = require('passport-local-mongoose');

module.exports = function(mongoose) {
    var User = mongoose.Schema({
        email               :   String,
    });
    var Tag = mongoose.Schema({
        name                :   {type: String, index: true, required: 'Tag must have a name'},
        imageCount          :   Number,
        description         :   {type: String}
    });
    var Comment = mongoose.Schema({
        poster              :   {type: ObjectId, ref: User},
        content             :   {type: String},
    });
    var Image = mongoose.Schema({
        filename            :   {type: String, unique: true},
        thumbnail           :   {type: Buffer},
        uploader            :   {type: ObjectId, ref: User},
        addDate             :   Date,
        tags                :   [String],
        comments            :   [Comment]
    });
    var Album = mongoose.Schema({
        creator             :   {type: ObjectId, ref: User},
        title               :   {type: String},
        images              :   [Image],
        private             :   Boolean
    });
    

    User.plugin(passportLocalMongoose);

    var models = {
      User      :   mongoose.model('User', User),
      Tag       :   mongoose.model('Tag', Tag),
      Image     :   mongoose.model('Image', Image),
      Comment   :   mongoose.model('Comment', Comment),
      Album     :   mongoose.model('Album', Album),
    };
    
    return models;
}