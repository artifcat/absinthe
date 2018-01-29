var thumbs = new Thumbs();
var grid = new ThumbsView({collection: thumbs});

thumbs.fetch({
    success: function(){
        grid.render();
    },
});

function search(){
    thumbs.queryParams.tags = $('#tags').val()//.replace(' ', '+');
    thumbs.fetch({
        success: function(model, response, options){
            $('.grid').empty();
            grid.render();
        }
    });
    return false;
}

function getDocHeight() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
}

$(window).on("scroll", function() {
	var scrollHeight = $(document).height();
	var scrollPosition = $(window).height() + $(window).scrollTop();
	if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
	    console.log("Getting next page...")
        if(thumbs.hasNextPage()){
            thumbs.getNextPage().done(function () {
                console.log("It's... here?")
                grid.render();
            });
        }
	}
});