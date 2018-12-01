let imageElements = []; //associative array for storing preloaded images in
let textCoordinates = []; // for storing database-fetched randomly selected text (and audio) and their coordinates in

var options = { //options for grain effect
    animate: true,
    patternWidth: 100,
    patternHeight: 100,
    grainOpacity: 0.05,
    grainDensity: 1,
    grainWidth: 1,
    grainHeight: 1
};


function preloadImage(url) { //does the actual preloading by loading the images into the global cache
    var image = new Image();
    image.src = url;
    return image;
}

$(document).ready(function() { //collective function for preloading everything

    $.ajax({ //preloading image files so that they don't have to be downloaded separately during gameplay
        type: 'POST',
        url: 'php/loadfiles.php',
        cache: false,
        success: function(result) {
            if(result) {
                let resultObj = eval(result);
                console.log(resultObj);
                if(resultObj.length > 2) //making sure that there are actually images to preload
                    preload(resultObj);
                preloadMessages();              
            } else {
                console.log('Error while fetching image files.');
            }
        }
    });

    function preloadMessages() {
        $.ajax({ //preloading text files so that they don't have to be downloaded separately during gameplay
        type: 'POST',
        url: 'php/getmessages.php',
        dataType: 'json',
        cache: false,
        success: function(result) {
                if(result) {
                    let resultObj = eval(result);
                    console.log('getmessages:',resultObj);           
                    textCoordinates = resultObj;

                    //indicating that things are done and we're ready to start
                    $('#percent').text(' 100 %');
                    $('#percent').append("<input type='button' value='Start' onclick='startGame()'>");

                } else {
                    console.log('Error while fetching messages.');
                }
            }
        });
    }
});

function preload(imgs) {
    // for some reason, in the json, there are "." and ".." before other images. this is to skip them
    imgs = imgs.slice(2);
    let progress = 0;
    $('#percent').text('0 %');
    let imgCount = imgs.length - 1; //accommodating for 0-based array and progress division
    console.log(imgCount);
    
    $(imgs).each(function(i) {      
        imageElements[this] = preloadImage("img/" + this); //inserts image objects into the associative array
        progress += Math.round(i/imgCount); //progress bar indicator
        $('#percent').text(progress + ' %');
    });

    console.log('imageElements: ',imageElements);
}