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
catsView.render();