let imageElements = []; //for storing preloaded images in
let texts = []; // for storing texts in

function preloadImage(url) { //does the actual preloading by loading the images into the global cache
    var image = new Image();
    image.src = url;
    return image;
}

$.ajax({ //preloading image files so that they don't have to be downloaded separately during gameplay
    type: 'POST',
    url: 'php/loadfiles.php',
    cache: false,
    success: function(result) {
        if(result) {
            let resultObj = eval(result);
            console.log(resultObj);
            preload(resultObj);
            $('#percent').append("<input type='button' value='Start' onclick='startGame()'>");
        } else {
            console.log('error');
        }
    }
});

$.ajax({ //preloading image files so that they don't have to be downloaded separately during gameplay
    type: 'POST',
    url: 'php/getmessages.php',
    dataType: 'json',
    cache: false,
    success: function(result) {
        if(result) {
            let resultObj = eval(result);
            console.log('getmessages:');
            console.log(resultObj);
            $(resultObj).each(function() {
                texts.push(this);
            });
            console.log(texts);
        } else {
            console.log('error');
        }
    }
});

function preload(imgs) {
    // skipdots: for some reason, in the json, there are "." and ".." before other images. this is to skip them
    let skipdots = 1;
    let progress = 0;
    $('#percent').text('0 %');
    
    $(imgs).each(function() {
        if (skipdots > 2) {
            //$('<img/>')[0].src = "img/";
            imageElements.push(preloadImage("img/" + this));
            progress += 1/41*100; //progress bar indicator
            $('#percent').text(progress + ' %');
        } else {
            skipdots++;
        }
    });
    $('#percent').text(' 100 %');
    console.log('imageElements: ');
    console.log(imageElements);
}