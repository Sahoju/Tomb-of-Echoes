var player;
var tileArray;
var phase; //for keeping track of the game's phase which determines text locations
var pC; //for keeping track of the player's coordinates
let chars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890+ÖÄåÅöä´!\"#¤%&/()=?`@£$€{[]}\\µ¨'^*~-.,_:;§½<>|ëÿüïâêûîãáéýúíóàèùìòñËÜÏÂÊÛÎÔÃÁÉÝÚÍÓÀÈÙÌÒÑÇçæÆ¢¥ƒ¿¬¼¡«»¦ß±°•·²€„…†‡‰Š‹Œ‘’“”™š›œŸ©®¯³¹¾Ð×ØÞð÷øþ"; // for #textbox; characters that can randomly replace any written character
// note: game doesn't allow at least ' character

let lengthbefore = 0; // for #textbox

function startGame() //setting the game up
{
    $('#percent').remove(); //removing progress bar
    $('#textWindow').css('visibility','visible'); //making the textWindow work
    $('#textWindow').toggle(); //turning it off at first  
    $('#controls img').not('#inspect').css('visibility','visible'); //displaying arrow key GUI controls, but not the inspect button
    //welcomeUser();

    //event listeners for player GUI arrows and keyboard arrows, moving and turning
    $('#arr1').on('click', function(){
        movePlayer(player.pDirection);       
    });
    $('#arr2').on('click', function(){
        turnPlayer(3);
    });
    $('#arr3').on('click', function(){
        movePlayer((player.pDirection + 2) % 4); //essentially flips the movement vector if the player is walking backwards
    });
    $('#arr4').on('click', function(){
        turnPlayer(1);
    });
    
    $('#inspect').on('click', function(){ //event listener for inspecting tile text
        //content in the json data is structured like "0_sound.ogg" where the digit is the index of the 
        //text to display from 'texts.txt' and the .ogg a sound to play... _ is the splitting char
        let textIndex = textCoordinates[phase + '' + pC[0] + '' + pC[1]].split("_")[0];
        $('#textWindow p').text(texts[textIndex]);
        
        // if text window is visible and write form is open, hide inspect text and show write form
        if($('#textWindow').css('display') == 'block' && 
          $('#writing').css('display') == 'block') {
            $('#writing').css('display', 'none');
            $('#inspected').css('display', 'block');
        }
        
        // if text window is visible and write form is visible, hide write form and then fade text window out
        else if($('#textWindow').css('display') == 'block' &&
            $('#inspected').css('display') == 'block') {
            $('#inspected').css('display', 'none');
            hideText();
        }
        
        // if text window is not visible, show text window and write form
        else if($('#textWindow').css('display') == 'none') {
            $('#inspected').css('display', 'block');
            showText();
        }
        
        /*
        let content = '<h3>There appears to be text written here...</h3><br><br><p style="font-family: Crazy Killer;line-height:45px;">'
            + texts[textIndex] + '</p>';
        showText(content);
        */
    });
    
    $('#writeButton').on('click', function(){ //event listener for write button
        // if text window is visible and inspect text is open, hide inspect text and show write form
        if($('#textWindow').css('display') == 'block' && 
          $('#inspected').css('display') == 'block') {
            $('#inspected').css('display', 'none');
            $('#textWindow p').text('');
            $('#writing').css('display', 'block');
        }
        
        // if text window is visible and write form is visible, hide write form and then fade text window out
        else if($('#textWindow').css('display') == 'block' &&
            $('#writing').css('display') == 'block') {
            $('#writing').css('display', 'none');
            hideText();
        }
        
        // if text window is not visible, show text window and write form
        else if($('#textWindow').css('display') == 'none') {
            $('#writing').css('display', 'block');
            showText();
        }
        
        /*
        console.log('clicked');
        // if ($('#formWindow').css('display') == 'none')
        let content = '<input type="text" id="textbox"> <input type="button" id="send" value="write"><br><br><p style="font-family: Crazy Killer;line-height:45px;"></p>';
        showText(content);
        */
    });
    
    // when something is typed on #textbox
    $('#writeTextbox').on('input', function() {
        console.log('type');
        // get #textbox value
        let value = $(this).val();
        // get the position of the random character from chars variable
        randomchar = Math.random() * chars.length;
        // generate number for the coming if-statement
        randomchance = Math.random() * 100;

        // if more than one letter was pasted
        if(value.length > lengthbefore + 1) {
            // iterate through all pasted letters
            for($i = lengthbefore; $i < value.length - 1; $i++) {
                if(Math.random() * 100 < 25) {
                    // New value before the pasted text stays.
                    // The letter in the corresponding position
                    // is replaced with a random character,
                    // and the rest of the string stays the same
                    // until the next iteration.
                    value =
                        value.substring(0,$i - 1) +
                        chars.charAt(Math.random() * chars.length) +
                        value.substring($i,value.length);
                }
            }
        }
        // if only one letter was added
        else if(randomchance < 25) {
            // change the last letter to a random character
            value = value.substring(0,value.length - 1) +
                chars.charAt(randomchar);
        }

        // re-initialize lengthbefore variable for coming inputs
        lengthbefore = value.length;
        // replace #textbox value with garbled text
        $('#writeTextbox').val(value);
    });
    
    $('#writeSend').on('click', function() {
        let textboxContent = $('#writeTextbox').val();
        console.log(textboxContent);
        let data = {
            x: pC[0],
            y: pC[1],
            content: textboxContent
        }
        $.post('php/writemessages.php', data, function(returnedData) {
            console.log(returnedData);
        });
    });
    
    $(window).keydown(function(event) {
        //showText();
        if(event.key == "ArrowUp") //making sure the pressed key was an arrow... apparently event.which is deprecated
            movePlayer(player.pDirection);
        else if (event.key == "ArrowLeft")
            turnPlayer(3);
        else if (event.key == "ArrowRight")
            turnPlayer(1);
        else if (event.key == "ArrowDown")
            movePlayer((player.pDirection + 2) % 4);
    })
    
    $('#everything').click(function(event) { //hiding text window when clicking out of it
        if(event.target !== event.currentTarget) return; //Do nothing if #everything was not directly clicked
        if ($('#textWindow').is(':visible')) {
            hideText();
        }
    });

    player = new Player("test"); //creating a Player object with name, includes methods for turning and moving
    tileArray = [[],[],[]]; //2D array for storing the grid tiles in
    phase = 0; //initializing game phase, varies between 0, 1 and 2

    // *** Initializing tiles with picture data ***
    tileArray[0][0] = new Tile(imageElements["bg09.png"],imageElements["bg00.png"],imageElements["bg02.png"],imageElements["bg10.png"]);
    tileArray[1][0] = new Tile(imageElements["bg10.png"],imageElements["bg03.png"],imageElements["bg01.png"],imageElements["bg04.png"]);
    tileArray[2][0] = new Tile(imageElements["bg09.png"],imageElements["bg10.png"],imageElements["bg00.png"],imageElements["bg02.png"]);
    tileArray[0][1] = new Tile(imageElements["bg03.png"],imageElements["bg01.png"],imageElements["bg04.png"],imageElements["bg09.png"]);
    tileArray[1][1] = new Tile(imageElements["bg05.png"],imageElements["bg06.png"],imageElements["bg07.png"],imageElements["bg08.png"]);
    tileArray[2][1] = new Tile(imageElements["bg04.png"],imageElements["bg09.png"],imageElements["bg03.png"],imageElements["bg01.png"]);
    tileArray[0][2] = new Tile(imageElements["bg00.png"],imageElements["bg02.png"],imageElements["bg09.png"],imageElements["bg10.png"]);
    tileArray[1][2] = new Tile(imageElements["bg01.png"],imageElements["bg04.png"],imageElements["bg10.png"],imageElements["bg03.png"]);
    tileArray[2][2] = new Tile(imageElements["bg02.png"],imageElements["bg10.png"],imageElements["bg09.png"],imageElements["bg00.png"]); 

    $('#everything').css('background-image', 'url(' + tileArray[0][0].viewArray[1].src + ')'); //player starting position view
}

function welcomeUser() //initial text popup that asks for the user's name (WIP)
{
    $('#textWindow').append("<h1 style='margin: 0 auto;'>Welcome.</h1><br><br><p>What is thy name, Spirit?</p><br><br><input type='text'> <button onclick='mainLoop()'>✓</button>");
}

function drawNext() //function for updating the background according to player coordinates and direction
{
    pC = player.getCoordinates();
    $('#everything').css('background-image', 'url(' + tileArray[pC[0]][pC[1]].viewArray[pC[2]].src + ')');
    getTileText(pC[0],pC[1]);
}

function getTileText(x, y) //checks if current tile has any text items to display via inspecting
{
    console.log(phase + '' + x + '' + y);
    if(textCoordinates[phase + '' + x + '' + y]) //this depends entirely on which coordinates have a text item and under which phase
    {
        $('#inspect').css('visibility','visible'); //displaying the inspect button
    }
    else if ($('#inspect').is(':visible')) //turning off the inspect button if the coordinates/phase no longer match
        $('#inspect').css('visibility','hidden');
}

function showText() //displays the text window in game
{
    // $('#textWindow').html(content); //displaying the pre-defined text according to the given index
    $('#textWindow').css({top:550,position:'absolute',opacity:0,display:'block'}).
    animate({top:'50%',opacity:1},600); //cool slide animation
}

function hideText() //hides the text window in game
{
    $('#inspected').css('display', 'none');
    $('#writing').css('display', 'none');
    $('#textWindow p').text('');
    $('#textWindow').fadeOut();
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