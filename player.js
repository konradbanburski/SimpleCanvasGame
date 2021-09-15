class Player {

  

    constructor(level, colour)
    {
        this.level = level;
        this.position.x = level.wall.width * (1 + 0,2);
        this.position.y = level.wall.height * (1 + 0,2);
        this.r = level.wall.height / 2 - 1;
        this.colour = colour;
        this.velocity.x = 0; 
        this.velocity.y = 0; 
        this.speed.x = level.wall.width /10;
        this.speed.y = level.wall.height /8;
        this.moving.left = false;
        this.moving.right = false;
        this.moving.up = false;
        this.gravity = level.wall.height / 25;
        this.fallingCounter = 1;     
        

       
         
        this.location.centerX = Math.floor(this.position.x / level.wall.width);    
        this.location.centerY = Math.floor(this.position.y / level.wall.height);
        this.location.left = Math.floor((this.position.x - this.r -0.01) / level.wall.width);     
        this.location.right = Math.floor((this.position.x + this.r -0.01) / level.wall.width);    
        this.location.top = Math.floor((this.position.y - this.r -0.01) / level.wall.height);    
        this.location.bottom = Math.floor((this.position.y + this.r -0.01) / level.wall.height);
        this.oldPosition.x = this.position.x;
        this.oldPosition.y = this.position.y;
    }

     

    level;
    
    position = { 
        x: 0,
        y: 0
    };
    
    r;
    colour;
    velocity = {
        x: null,
        y: null
    };
    speed = {
        x: null,
        y: null
    };
    moving = {
        left: null,
        right: null,
        up: null
    };
    gravity;
    fallingCounter;
    
    location = {
        centerX: Math.floor(this.position.x / this.level.wall.width),   
        centerY: Math.floor(this.position.y / this.level.wall.height),
        left: Math.floor((this.position.x - this.r -0.01) / this.level.wall.width),
        right: Math.floor((this.position.x + this.r -0.01) / this.level.wall.width),
        top: Math.floor((this.position.y - this.r -0.01) / this.level.wall.height),
        bottom: Math.floor((this.position.y + this.r -0.01) / this.level.wall.height)
        };

    walls = {
        center: 0,
        left: null,
        right: null,
        top: null,
        bottom: null
        }; 
    
    oldPosition = {
        x: 0,
        y: 0
    }; 

    checkSolidWalls(walls, location, oldPosition)
    {
        console.log(this.level)

        if(walls.left.solid == 1) {
            if(position.x < oldPosition.x)
                position.x = (location.left + 1) * level.wall.width + this.r;
        }

        if(walls.right.solid == 1) {
            if(position.x > t.oldPosition.x)
                position.x = (location.right - 1) * level.wall.width + this.r;
        }

        if(walls.top.solid == 1) {
            if(position.y < oldPosition.y)
                position.y = (location.top + 1) * level.wall.width + this.r;
        }

        if(walls.bottom.solid == 1) {
            if(position.y > oldPosition.y)
                position.y = (location.top - 1) * level.wall.width + this.r;
                this.fallingCounter = 1;
        }
        
    }

    draw(context) {
        context.fillStyle = this.colour;
        context.beginPath();
        context.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI );
        context.fill(); 
    }

    move(context) {
        this.position = {
            x: this.position.x + this.velocity.x,
            y: this.position.y + this.velocity.y + this.gravity * this.fallingCounter
        }
        this.fallingCounter += 0.15;
        this.checkSolidWalls(this.walls, this.location, this.oldPosition);
        this.draw(context);
    }

   

    startMoving(key, context) {
        switch(key) {
            case 37:
                this.moving.left = true;
                break;
            case 38:
                if(!this.moving.up) this.fallingCounter = 1;
                this.moving.up = true;
                break;
            case 39:
                this.moving.right = true;
                break;
        };
        
        this.setMoving();
    }
    
    stopMoving(key, context) {
        switch(key) {
            case 37:
                this.moving.left = false;
                break;
            case 38:
                this.fallingCounter = 1;
                this.moving.up = false;
                break;
            case 39:
                this.moving.right = false;
                break;
        };
        
        this.setMoving();
    }

    setMoving() {
        this.velocity = {x: 0, y: 0};
        if(this.moving.left) this.velocity.x -= this.speed.x;
        if(this.moving.up) this.velocity.y -= this.speed.y;
        if(this.moving.right) this.velocity.x = this.speed.x;
    }
}