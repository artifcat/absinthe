var Tag = Backbone.Model.extend({
    defaults: {
        name: '__error',
        picturesTagged: -1
    },
});

var Image = Backbone.Model.extend({
    defaults: {
        _id: "-1",
        filename: "error.jpg",
        tags:[],
        uploader: "test_user",
        source: ""
    },
});

var ImageView = Backbone.View.extend({
    events: {
        //'click': 'alertTest'
    },
    newTemplate: _.template('<a><img src="../img/<%= filename %>"></a>'),
    initialize: function(){
        this.render();
    },
    render: function(){
        console.log("lol:" + this.model.filename);
        this.$el.html(this.newTemplate(this.model.toJSON()));
    }
});

var ImageCollection = Backbone.Collection.extend({
    model: Image
});

var ImagesView = Backbone.View.extend({
    initialize: function(){
        this.collection;
    },
    render: function(){
        this.collection.each(function(Image){
            var imageView = new ImageView({model: Image});
            console.log(imageView);
            $(document.body).append(imageView.el);
        });
    }
});

var images = new ImageCollection(imageArray);
console.log(images);

var imagesView = new ImagesView({collection: images});
imagesView.render();

//TODO: figure out if this is actually a right way of using backbone

/*
var Cat = Backbone.Model.extend({
    defaults: {
        name: 'Mana',
        color: 'black',
        weight: 3.7
    },
    validate: function(attrs, options){
        if (!attrs.name){
            alert('Your cat must have a name!');
        }
    },
    meow: function(){
        alert(this.get('name') + " says meow");
    }
});

var CatView = Backbone.View.extend({
    tagName: 'li',
    events: {
        'click': 'alertTest'
    },
    newTemplate: _.template($('#catTemplate').html()),
    alertTest: function(){
        this.model.meow();
    },
    initialize: function(){
        this.render();
    },
    render: function(){
        this.$el.html(this.newTemplate(this.model.toJSON()));
    }
});

var CatCollection = Backbone.Collection.extend({
    model: Cat
});

var CatsView = Backbone.View.extend({
    tagName: 'ul',
    initialize: function(){
        this.collection;
    },
    render: function(){
        this.collection.each(function(Cat){
            var catView = new CatView({model: Cat});
            $(document.body).append(catView.el);
        });
    }
});

var catCollection = new CatCollection(cats);

var catsView = new CatsView({collection: catCollection});
catsView.render();*/