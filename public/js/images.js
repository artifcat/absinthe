var thumbs = new Thumbs();
var grid = new ThumbsView({collection: thumbs});

thumbs.fetch({
    success: function(){
        grid.render();
    },
});

function search(){
    thumbs.queryParams.tags = $('#tags').val()//.replace(' ', '+');
    thumbs.fetch();
    grid.render();
}