class Player {
    constructor(playerName)
    {
        this.x = 0; //player starting position is on the top-left tile
        this.y = 0;
        this.direction = 1; //player direction can vary between 0 and 3. 0 = North, 1 = East, 2 = South, 3 = West
        this.name = playerName; //player gets to pick a name in the beginning
    }

    getCoordinates() { //method for returning player coordinates to game.js
        let coordinates = [this.x, this.y];
        return coordinates;
    }

    get pDirection() { //returns player direction for event listeners in game.js
        return this.direction;
    }

    turn(d) { //allows the player to turn left or right according to the direction (d) (either 1 or 3)       
        this.direction = (this.direction + d) % 4;       
    }

    move(d) { //allows the player to move forwards or backwards according to their direction
        
        switch(d) //checking current direction
        {
            case 0:
                if ((this.y - 1) >= 0)
                    this.y -= 1;
                break;
            case 1:
                if ((this.x + 1) <= 2)
                    this.x += 1;
                break;
            case 2:
                if ((this.y + 1) <= 2)
                    this.y += 1;
                break;
            case 3:
                if ((this.x - 1) >= 0)
                    this.x -= 1;
                break;
        }
    }
}