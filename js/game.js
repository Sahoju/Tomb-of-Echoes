var player;
var tileArray;
var phase; //for keeping track of the game's phase which determines text locations
var pC; //for keeping track of the player's coordinates
var d; //for keeping track of the player's direction
let chars = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890+ÖÄåÅöä´!\"#¤%&/()=?`@£$€{[]}\\µ¨'^*~-.,_:;§½<>|ëÿüïâêûîãáéýúíóàèùìòñËÜÏÂÊÛÎÔÃÁÉÝÚÍÓÀÈÙÌÒÑ"; // for #textbox; characters that can randomly replace any written character
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
        turnPlayer(3); //turn left
    });
    $('#arr3').on('click', function(){
        movePlayer((player.pDirection + 2) % 4); //essentially flips the movement vector if the player is walking backwards
    });
    $('#arr4').on('click', function(){
        turnPlayer(1); //turn right
    });
    
    $('#inspect').on('click', function(){ //event listener for inspecting tile text
        if($('#inspected').css('display') == 'none')
            showText(true);
        else
            hideText();
    });
    
    $('#writeButton').on('click', function(){ //event listener for write button
        if($('#writing').css('display') == 'none')
            showText(false);
        else
            hideText();
    });
    
    $('#writeTextbox').on('input', function() { //event listener for typing text in write window
        writeText(this);
    });
    
    $('#writeSend').on('click', submitText); //event listener for clicking the submission button in write window
    
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

    pC = player.getCoordinates(); //initializing a local tracker for player coordinates
    $('#everything').css('background-image', 'url(' + tileArray[0][0].viewArray[1].src + ')'); //player starting position view
    grained('#everything',options); //initializing grain effect
}

/*function welcomeUser() //initial text popup that asks for the user's name (WIP)
{
    $('#textWindow').append("<h1 style='margin: 0 auto;'>Welcome.</h1><br><br><p>What is thy name, Spirit?</p><br><br><input type='text'> <button onclick='mainLoop()'>✓</button>");
}*/

function drawNext() //function for updating the background according to player coordinates and direction
{
    $('#everything').css('background-image', 'url(' + tileArray[pC[0]][pC[1]].viewArray[player.pDirection].src + ')');   
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

function incrementPhase() //changing the phase of the game if no messages corresponding to the current phase exist anymore
{
    if(!Object.keys(textCoordinates).find(function(element) {
        return element[0] == phase; //if a textCoordinate exists with current phase, don't increment phase (notice the !)
    })) {
        if (phase != 2)
        {
            phase++;
            increaseGrain(31);
        }
        else //phases are between 0 and 2, so if the phase is 2 and no more texts exist, the game ends
        {
            increaseGrain(91);
            endGame();
        }
    }      
}

async function increaseGrain(amount) //function for increasing grain effect asynchronously
{
    for(i = 1; i != amount; i++)
        { 
            options.grainOpacity += 0.005;
            grained('#everything',options);
            await sleep(10);
        }  
}

function sleep(ms) { //function for sleeping async functions
    return new Promise(resolve => setTimeout(resolve, ms));
}

function endGame() //ends the game after all text has been read
{
    $(document.body).css({'transition': 'background-color ease-in 7s','background-color': '#000'}); //transitioning body bg color to black
    $('#everything').fadeOut(7000, function() { //fading out game window and displaying ending text
        $('#middle').append('<h3>Reality fades into nothingness as you wander around endlessly inside this tomb of lost souls...</h3><br><br><p style="font-family: Tibetan Beefgarden AOE;">YOU BELONG HERE NOW<p>').children().hide();
        //fading in final texts and then fading them out and closing the tab
        $('#middle h3').delay(2000).css({opacity:0,display:'block'}).
        animate({opacity:1},5000);
        $('#middle p').delay(8000).css({opacity:0,display:'block'}).
        animate({opacity:1},2000);
        $('#middle').delay(15000).fadeOut(5000);
    });
}

function movePlayer(d) { //event handler for letting the player move forwards and backwards   
    if ($('#textWindow').is(':visible'))
        hideText(); //hiding the text window if the player decides to move 
        
    incrementPhase(); //updating game phase if needed

    player.move(d);

    pC = player.getCoordinates(); //updating knowledge of player x and y for rendering purposes
    getTileText(pC[0],pC[1]); //displaying the inspect button if this new tile contains text

    drawNext();
}

function turnPlayer(d){ //event handler for letting the player turn left and right
    player.turn(d);
    drawNext();
}

function showText(isRead) //displays the text window in game, depending on whether the operation is reading or writing
{
    if (isRead) //reading (inspect) operation
    {
        $('#inspected').show();
        $('#writing').hide();

        //parsing text content based on what phase it is and where the player is at
        let text = textCoordinates[phase + '' + pC[0] + '' + pC[1]];
        $('#textWindow p').text(text);

        //once the player has read the message, it will disappear once he walks out of the square
        delete textCoordinates[phase + '' + pC[0] + '' + pC[1]];
    }
    else //writing operation
    {
        $('#inspected').hide();
        $('#writing').show();
    }

    if($('#textWindow').css('display') == 'none')
        $('#textWindow').css({top:550,position:'absolute',opacity:0,display:'block'}).
        animate({top:'50%',opacity:1},600); //cool slide animation
}

function hideText() //hides the text window in game
{
    $('#inspected').css('display', 'none');
    $('#writing').css('display', 'none');
    $('#textWindow').fadeOut();
}

function writeText(input) // when something is typed on #textbox
{
    console.log('type');
    // get #textbox value
    let value = $(input).val();
    // get the position of the random character from chars variable
    randomchar = Math.random() * chars.length;
    // generate number for the coming if-statement
    randomchance = Math.random() * 100;

    if(randomchance < 33) {
        // if more than one letter was pasted
        if(value.length > lengthbefore + 1) {
            // iterate through all pasted letters
            for($i = lengthbefore; $i < value.length - 1; $i++) {           
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
        // if only one letter was added, excluding spaces
        else if (value[value.length - 1] != ' ') {
            // change the last letter to a random character
            value = value.substring(0,value.length - 1) +
            chars.charAt(randomchar);
        }
    }

    // re-initialize lengthbefore variable for coming inputs
    lengthbefore = value.length;
    // replace #textbox value with garbled text
    $('#writeTextbox').val(value);
}

function submitText() //submitting player input to the database when pressing "Write"
{
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
    hideText();
}