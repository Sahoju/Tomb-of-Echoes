var player;
var tileArray;


function startGame() //setting the game up
{  
    $('#percent').remove(); //removing progress bar
    $('#textWindow').css('visibility','visible'); //making the textWindow work
    $('#textWindow').toggle(); //turning it off at first
    //welcomeUser();

    $('#1strow td:nth-child(2)').append( //coupling UI controls with their respective images (arrows)
        $('<img>').attr({src: imageElements[0].src,
                        width: 50,
                        height: 50,
                        id: 'arr0'}));

    for (i = 1; i < 4; i++) //arrow controls are arranged in table cells
    {
        $('#2ndrow td:nth-child(' + i + ')').append(
            $('<img>').attr({src: imageElements[i].src,
                            width: 50,
                            height: 50,
                            id: 'arr' + i }));
    }

    //event listeners for player GUI arrows and keyboard arrows, moving and turning
    $('#arr0').on('click', function(){
        movePlayer(player.pDirection);       
    });
    $('#arr1').on('click', function(){
        turnPlayer(3);
    });
    $('#arr2').on('click', function(){
        movePlayer((player.pDirection + 2) % 4); //essentially flips the movement vector if the player is walking backwards
    });
    $('#arr3').on('click', function(){
        turnPlayer(1);
    });
    $(window).keydown(function(event) {
        showText();
        if(event.key == "ArrowUp") //making sure the pressed key was an arrow... apparently event.which is deprecated
            movePlayer(player.pDirection);
        else if (event.key == "ArrowLeft")
            turnPlayer(3);
        else if (event.key == "ArrowRight")
            turnPlayer(1);
        else if (event.key == "ArrowDown")
            movePlayer((player.pDirection + 2) % 4);
    })
    $('#everything').click(function() { //hiding text window when clicking out of it
        if ($('#textWindow').is(':visible'))
            hideText();
    })
 
    imageElements = imageElements.splice(4); //removing UI elements from image array, leaving only backgrounds

    player = new Player("test"); //creating a Player object with name, includes methods for turning and moving
    tileArray = [[],[],[]]; //2D array for storing the grid tiles in
    // *** Initializing tiles with picture data ***
    tileArray[0][0] = new Tile(imageElements[9],imageElements[0],imageElements[2],imageElements[10]);
    tileArray[1][0] = new Tile(imageElements[10],imageElements[3],imageElements[1],imageElements[4]);
    tileArray[2][0] = new Tile(imageElements[9],imageElements[10],imageElements[0],imageElements[2]);
    tileArray[0][1] = new Tile(imageElements[3],imageElements[1],imageElements[4],imageElements[9]);
    tileArray[1][1] = new Tile(imageElements[5],imageElements[6],imageElements[7],imageElements[8]);
    tileArray[2][1] = new Tile(imageElements[4],imageElements[9],imageElements[3],imageElements[1]);
    tileArray[0][2] = new Tile(imageElements[0],imageElements[2],imageElements[9],imageElements[10]);
    tileArray[1][2] = new Tile(imageElements[1],imageElements[4],imageElements[10],imageElements[3]);
    tileArray[2][2] = new Tile(imageElements[2],imageElements[10],imageElements[9],imageElements[0]);
        
    console.log(imageElements);
    $('#everything').css('background-image', 'url(' + tileArray[0][0].viewArray[1].src + ')'); //player starting position view
}

function showText() //displays the text window in game
{
    $('#textWindow').fadeIn();
}

function hideText() //hides the text window in game
{
    $('#textWindow').fadeOut();
}

function welcomeUser() //initial text popup that asks for the user's name (WIP)
{
    $('#textWindow').append("<h1 style='margin: 0 auto;'>Welcome.</h1><br><br><p>What is thy name, Spirit?</p><br><br><input type='text'> <button onclick='mainLoop()'>✓</button>");
}

function drawNext() //function for updating the background according to player coordinates and direction
{
    let pC = player.getCoordinates();
    $('#everything').css('background-image', 'url(' + tileArray[pC[0]][pC[1]].viewArray[pC[2]].src + ')');
}

function movePlayer(d) { //event handler for letting the player move forwards and backwards
    if ($('#textWindow').is(':visible'))
        hideText(); //hiding the text window if the player decides to move      
    player.move(d);
    drawNext();
}

function turnPlayer(d){ //event handler for letting the player turn left and right
 
    player.turn(d);
    drawNext();
}