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
        comments: [],
        uploader: "test_user",
    },
});

var Thumbs = Backbone.PageableCollection.extend({
    model: Image,
    url: '/api/images',
    mode: 'infinite',
    state: {
        firstPage: 0,
        currentPage: 0,
        pageSize: 32,
        totalRecords: 40,
    },
    queryParams: {
        currentPage: "current_page",
        pageSize: "page_size",
        tags: ''
    }
});


var ThumbView = Backbone.View.extend({
    events: {
        //'click': 'alertTest'
    },
    className: 'thumb',
    newTemplate: _.template('<a href="/image/<%= _id %>"><img src="/api/thumb/<%= _id %>"/></a>'),
    initialize: function(){
        this.render();
    },
    render: function(){
        this.$el.html(this.newTemplate(this.model.toJSON()));
    }
});

var ThumbsView = Backbone.View.extend({
    initialize: function(){
        this.collection;
    },
    render: function(){
        this.collection.each(function(Image){
            var thumbView = new ThumbView({model: Image});
            $('.grid').append(thumbView.el);
        });
    }
});