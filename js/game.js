class Game 
{ 
    constructor ()
    {       
        this.timerStart = performance.now(); //timing gameplay time
        this.welcomeUser();
    }

    welcomeUser() //initial text popup that asks for the user's name
    {
        let mainWindow = $('#textWindow');
        $(mainWindow).append("<h1 style='margin: 0 auto;'>Welcome.</h1><br><br><p>What is thy name, Spirit?</p><br><br><input type='text'> <button onclick='mainLoop()'>✓</button>");
    }

    mainLoop()
    {
        
    }
}