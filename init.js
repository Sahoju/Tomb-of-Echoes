let progressdiv = $('#percent');

$.ajax({
    type: 'POST',
    url: 'php/loadfiles.php',
    cache: false,
    success: function(result) {
        if(result) {
            let resultObj = eval(result);
            console.log(resultObj);
            preload(resultObj);
            $(progressdiv).append("<input type='button' value='Start' onclick='startGame()'>");
        } else {
            console.log('error');
        }
    }
});

// skipdots: for some reason, in the json, there are "." and ".." before other images. this is to skip them
let skipdots = 1;
let progress = 0;
$(progressdiv).text('0 %');

function preload(imgs) {
    $(imgs).each(function() {
        if (skipdots > 2) {
            $('<img/>')[0].src = "img/";
            progress += 1/41*100;
            $(progressdiv).text(progress + ' %');
        } else {
            skipdots++;
        }
    });
    $(progressdiv).text(' 100 %');
}

function startGame() {
    removeProgress();
    var game = new Game();

}

function removeProgress() {
    $(progressdiv).remove();
}