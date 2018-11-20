// apply new div and img to #everything
$('#everything').append("<div id='movie'></div>");
$('#movie').append('<img id="img00" src="img/img00.jpg" />');
// apply initial css to animate from
$('#img00').css({
    'position': 'relative',
    'opacity': '0',
    'top': '300px',
    'left': '500px'
});
// animate to
$('#img00').animate({
    opacity: 1,
    left: '-=200'
}, 5000, 'linear');
$('#img00').animate({
    'top': '-=300',
    'left': '-=300'
}, 5000, 'linear');