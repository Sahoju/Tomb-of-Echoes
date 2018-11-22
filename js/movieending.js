$('#everything').append('<div id="grain"></div>');
// the div needs opacity to show elements underneath
// grained.js' opacity does not show elements under it
$('#grain').css({
    'position': 'absolute',
    'width': '1280px',
    'height': '720px',
    'opacity': '0.4'
});

// grained.js stuff
let options = {
  "animate": true,
  "patternWidth": 377.43,
  "patternHeight": 350.42,
  "grainOpacity": 1,
  "grainDensity": 1.5,
  "grainWidth": 10,
  "grainHeight": 10
}
grained("#grain", options);

/*
background-color :rgb(204, 204, 204)
*/
// grained.js stuff ends

$('#everything').append('<img id="img00" src="img/img00.jpg" />');
$('#img00').css({
    'position': 'absolute',
    'opacity': '0'
});
// execute flashImg() after 5 seconds. probably not needed in the final version
window.setTimeout(flashImg, 5000);

function flashImg() {
    $('#img00').css({
        'opacity': '0.6',
    });
    
    // queue: false - can do many animations at once
    $('#img00').animate({
        opacity: 0
    },{
        duration: 2000,
        queue: false
    });
    $('#grain').animate({
        opacity: 0
    },{
        duration: 5000,
        queue: false
    });
}

