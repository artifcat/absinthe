var thumbs = new Thumbs();
var grid = new ThumbsView({collection: thumbs});

thumbs.queryParams.tags = $('#tags').val();
thumbs.fetch({
    success: function(){
        grid.render();
    },
});

function search(){
    thumbs.queryParams.tags = $('#tags').val();//.replace(' ', '+');
    thumbs.fetch({
        success: function(model, response, options){
            $('.grid').empty();
            grid.render();
        }
    });
    return false;
}

$(window).on("scroll", function() {
    var scrollHeight = $(document).height();
    var scrollPosition = window.innerHeight + $(document).scrollTop();
   
    //console.log((scrollHeight - scrollPosition))
	if ((scrollHeight - scrollPosition) <= 10) {
        if(thumbs.hasNextPage()){
            thumbs.getNextPage().done(function () {
                grid.render();
            });
        }
	}
});