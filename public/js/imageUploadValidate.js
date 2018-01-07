$('form').on('submit', function(){
    var tagPattern = new RegExp("[0-9a-z-_/()]{3,}");
    var tagList = $('form #tags').val().split(' ');
    $('.error').remove();
    
    if(tagList[0] == ''){
        $('<div class="error">Please choose at least one tag for the image.</div>').insertAfter('.menu');
        return false;
    }

    for(tag in tagList){
        if(!tagPattern.test(tagList[tag])){
            $('<div class="error">Invalid tag: ' + tagList[tag]+ '</div>').insertAfter('.menu');
            return false;
        }
    }

    if(image.value == ''){
        $('<div class="error">Please select an image to upload</div>').insertAfter('.menu');
        return false;
    }

    return true;

});