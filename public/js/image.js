$(document).ready(function(){
    $('a.tag').click(function(event){
        console.log(event.target)
        $('#tag').val(event.target.innerHTML);
        $('#sform').submit()
    });
});