/*
var changePicture = function(){
    if (img == nImages)
        img = 1
    else
        img++

    $('header').css("background-image", "url(Content/img/Danilo/Danilo"+img+".jpg)");
    setTimeout(changePicture, 4000);
}
img = 0
nImages = 4
//setTimeout(changePicture, 4000);
*/

height = $(window).height();
$('.slider-img').css('height', height);

var changeHeight = function(){
    if ($(window).height() != height){
        height = $(window).height();
        $('.slider-img').css('height', height);
    }
    setTimeout(changeHeight, 300);
}

changeHeight();
