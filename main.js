

document.addEventListener('DOMContentLoaded', function(event) {

    //Przypisanie pola do zmiennej canvas
    var canvas = document.getElementById('canvas');
    //Przypisanie zawartości elementu canvas
    var context = canvas.getContext('2d');
    //Ustawienie wymiarów canvas
    canvas.width = 900;
    canvas.height = 900;
    //Ustawienie koloru wypełnienie
    context.fillStyle = '#DDDDDD';
    //Narysowanie prostokąta o wymiarach elementu canvas
    context.fillRect(0, 0, canvas.width, canvas.height);
    var mapFlag = 0;
    
  
    
    //Mapy
    firstMap = new FirstMap();
    secondMap = new SecondMap();

    level = new Level(firstMap.wallWidth, firstMap.wallHeight, canvas.width, canvas.height, firstMap.walls, firstMap.map);
    level2 = new Level(secondMap.wallWidth, secondMap.wallHeight, canvas.width, canvas.height, secondMap.walls, secondMap.map);
    
    //Gracz
    player = new Player(level, '#0000DD');

   

    
    document.addEventListener('keydown', function(event) {
        player.startMoving(event.keyCode, context);
    })

    document.addEventListener('keyup', function(event) {
        player.stopMoving(event.keyCode, context);
    })

    if(level.sizeChecker(level.map, firstMap.wallWidth, firstMap.wallHeight, canvas.width, canvas.height)) {
        mapFlag++;
    }
    
    if(level.mapChecker(level.map, firstMap.wallWidth, firstMap.wallHeight, canvas.width, canvas.height)) {
        mapFlag++;
    }

    if(level.checkWall(level.map, level.walls)) {
        mapFlag++;
    }

    if(mapFlag == 3) {
        level.drawMap(context);
        player.draw(context);
        mapFlag == 0;
        console.log('READY');
    }
    else {
        alert('Map error.'); 
    }
    

    function drawGame() {
        context.clearRect(0, 0, canvas.width, canvas.height); 
        if(player.win == 0) {
            if(player.key) {
                level.map[13][3] = 0;
                level.map[14][3] = 0;
                level.map[28][28] = 0;
            }
            level.drawMap(context);
        }
        if(player.win == 1) {
            player.level = level2;
            if(player.key) {
                level2.map[3][4] = 0;
                level2.map[3][5] = 0;
                level2.map[22][4] = 0;
           
            }
            level2.drawMap(context);
        }
        if(player.win == 2) {
            alert('You win this game!');
        }
        player.move(context);
    }
    setInterval(drawGame, 1000/25);
    
})



class Level {
    #wall;
    #width;
    #height;
    #walls;
    #map;
    constructor(wallWidth, wallHeight, canvasWidth, canvasHeight, walls, map) {
        this.#wall = { width: wallWidth, height: wallHeight };
        this.#width = canvasWidth / wallWidth;
        this.#height = canvasHeight / wallHeight;
        this.#walls = walls;
        this.#map = map;
        
    }

    get wall() {
        return this.#wall;
    }

    get walls() {
        return this.#walls;
    }

    get map() {
        return this.#map;
    } 


    /*   set wall(size) {
          var canvasWidth = this.#wall.width * this.#width;
          var canvasHeight = this.#wall.height * this.#height;

          this.#wall = { width: size.width, height: size.height };

          this.#width = canvasWidth / size.width;
          this.#height = canvasHeight / size.height;
      } */

    drawWall(x1, y1, x2, y2, colour, context) {
        context.fillStyle = colour;
        context.fillRect(x1, y1, x2, y2)
    }

    drawMap(context) {
        for (var y = 0; y < this.#height; y++) {
            for (var x = 0; x < this.#width; x++) {
                this.drawWall(
                    x * this.#wall.width,
                    y * this.#wall.height,
                    (x + 1) * this.#wall.width,
                    (y + 1) * this.#wall.height,
                    this.#walls[this.#map[y][x]].colour,
                    context
                );
            }
        }
    }
    
    checkWall(map, walls) {
        
        for(var y = 0; y<map.length; y++) {  
            for(var x = 0; x<map[y].length; x++) {
                    if(typeof walls[map[y][x]] === "undefined") {
                        console.log('checkWall error: ' + walls[map[y][x]]);
                        return false                       
                    }
            } 
        }
        console.log('checkWall: correct');
        return true 
       
    }

    sizeChecker(map, wallWidth, wallHeight, canvasWidth, canvasHeight) {
        var elementsY = map.length
        var elementsX = map[0].length
        if((canvasWidth / wallWidth == elementsX) && (canvasHeight / wallHeight == elementsY)) {
            console.log('sizeChecker: correct');
            return true
        }
        else {
            console.log('sizeChecker: error: ' + canvasWidth + '/' + wallWidth + '==' + elementsX + '&&' + canvasHeight + '/' + wallHeight + '==' + elementsY)
            return false
        }
    }

    mapChecker(map, wallWidth, wallHeight, canvasWidth, canvasHeight) {
        var tabY = map.length
        var xElements = canvasWidth / wallWidth;
        var yElements = wallHeight / canvasHeight;
        if(tabY < yElements) {
            console.log('mapChecker: error mapY elements:' + tabY + ' < ' + yElements);
            return false
        }
        for(var y = 0; y < tabY; y++) {
            if(map[y].length < xElements) {
                console.log('mapChecker: error mapX elements:' + map[y] + ' < ' + xElements);
                return false
            }
        }
        console.log('mapChecker: correct');
        return true
    }
}

class Player {

  

    constructor(level, colour)
    {
        this.level = level;
        this.position.x = level.wall.width * (1 + 0,2);
        this.position.y = level.wall.height * (1 + 0,2);
        this.r = (level.wall.height / 2) - 1;
        this.colour = colour;
        this.velocity.x = 0; 
        this.velocity.y = 0; 
        this.speed.x = level.wall.width/5;
        this.speed.y = level.wall.height/ 4,5;
        this.moving.left = false;
        this.moving.right = false;
        this.moving.up = false;
        this.gravity = level.wall.height / 25;
        this.fallingCounter = 1;     
        this.min = 0;
        this.sec = 0;
        this.frame = 0;
        this.key = false;
        this.win = 0;
    }

     
    win;
    level;
    key;
    min;
    sec;
    frame;
    position = { 
        x: 0,
        y: 0
    };
    
    r;
    colour;
    velocity = {
        x: 0,
        y: 0
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
        centerX: 0,
        centerY: 0,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
        };

    walls = {
        center: 0,
        left: 0,
        right: 0,
        top: 0,
        topLeft: 0,
        topRight: 0,
        bottom: 0,
        bottomLeft: 0,
        bottomRight: 0
        }; 
    
    oldPosition = {
        x: 0,
        y: 0
    }; 

    canJump = true;
    jump = 5;

    setlocation() {
        this.location = {
            centerX: Math.floor(this.position.x / this.level.wall.width),   
            centerY: Math.floor(this.position.y / this.level.wall.height),
            left: Math.floor((this.position.x - this.r -0.01) / this.level.wall.width),
            right: Math.floor((this.position.x + this.r -0.01) / this.level.wall.width),
            top: Math.floor((this.position.y - this.r -0.01) / this.level.wall.height),
            bottom: Math.floor((this.position.y + this.r -0.01) / this.level.wall.height)  
            };
        }

    setwalls() {

        this.walls = {
        center: this.level.walls[ this.level.map[this.location.centerY][this.location.centerX]],
        left: this.level.walls[ this.level.map[this.location.centerY][this.location.left]],
        right: this.level.walls[ this.level.map[this.location.centerY][this.location.right]],
        top: this.level.walls[ this.level.map[this.location.top][this.location.centerX]],
        topLeft: this.level.walls[ this.level.map[this.location.top][this.location.left]],
        topRight: this.level.walls[ this.level.map[this.location.top][this.location.right]],
        bottom: this.level.walls[ this.level.map[this.location.bottom][this.location.centerX]],
        bottomLeft: this.level.walls[ this.level.map[this.location.bottom][this.location.left]],
        bottomRight: this.level.walls[ this.level.map[this.location.bottom][this.location.right]]
        }
    }

    draw(context) {
        context.fillStyle = this.colour;
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.r, 0, 2 * Math.PI );
        context.fill();
        if(this.sec == 59) { 
            this.min++;
            this.sec = 0;
        } 
        if(this.frame == 25) {
            this.sec++
            this.frame = 0;
        }
        this.frame ++ 
        this.drawTime(context);

    }

    drawTime(context) {
        context.fillStyle = 'white';
        context.font = '30px serif';
        
        context.fillText('Czas: ' + this.min + ":" + this.correctSecView(), 10, 22);
    }

    correctSecView()
    {
        if(this.sec<10) {
            return '0'+ this.sec;
        }
        else {
            return this.sec;
        }
    }
    move(context) {
       
        this.oldPosition = this.position;
   
        this.position = {
            x: this.position.x + this.velocity.x,
            y: this.position.y + this.velocity.y + this.gravity * this.fallingCounter
            
        }
        this.fallingCounter += 0.15;
        
        this.setlocation();
        this.setwalls();
        this.checkSolidWalls(this.walls, this.location, this.oldPosition);
        this.checkSpecialWalls(this.walls);
        console.log(
            this.walls.topLeft.id + " " + this.walls.top.id + " " + this.walls.topRight.id + "\n " +
            this.walls.left.id + " " + this.walls.center.id + " " + this.walls.right.id + "\n " +
            this.walls.bottomLeft.id + " " + this.walls.bottom.id + " " + this.walls.bottomRight.id + "\n " 
        );
        this.draw(context);

    }

    checkSpecialWalls(walls) {
        this.checkWinWalls(walls);
        this.checkLoseWalls(walls);
        this.checkKey(walls);
    }

    checkWinWalls(walls) {
        if(walls.top.id == 'win' || walls.bottom.id == 'win'|| walls.left.id == 'win' || walls.right.id == 'win') {
            alert(' WIN! :) \n Czas: ' + this.min + ":" + this.correctSecView());
            this.win ++;
            this.position = {
                x: level.wall.width * (1 + 0,2),
                y: level.wall.height * (1 + 0,2)
            }
            player.key = false;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.min = 0;
            this.sec = 0;
            this.frame = 0;
        }   
    }
        

    checkLoseWalls(walls) {
        if(walls.top.id == 'lose' || walls.bottom.id == 'lose'|| walls.left.id == 'lose' || walls.right.id == 'lose') {
            alert(' LOSE! :( \n Czas: ' + this.min + ":" + this.correctSecView());
            this.position = {
                x: level.wall.width * (1 + 0,2),
                y: level.wall.height * (1 + 0,2)
            }
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.min = 0;
            this.sec = 0;
            this.frame = 0;
        }
    }

    checkKey(walls) {
        if(walls.top.id == 'key' || walls.bottom.id == 'key'|| walls.left.id == 'key' || walls.right.id == 'key') {
            this.key = true;
            console.log(this.key);
        }
    }

    checkSolidWalls(walls, location, oldPosition)
    {
       
       
       if(walls.bottom.id == 'jump')
       {
           this.jump++;
           this.velocity.y = 0
          
           
           
           if(this.jump < 14) {
                this.velocity.y = -this.jump;
                
           }
           else {
            this.velocity.y = -13
           }
          
           
       }


        if(walls.left.solid == 1) {
            this.canJump = true;
            if(this.position.x < oldPosition.x)
                this.position.x = (location.left + 1.1) * level.wall.width + this.r;
                this.jump = 5;
        }
        
        if(walls.right.solid == 1) {
            this.canJump = true;
            if(this.position.x > oldPosition.x)
                this.position.x = (location.right - 1) * level.wall.width + this.r;
                this.jump = 5;
                
        }
        
        if(walls.top.solid == 1) {
            if(this.moving.left || this.moving.right || this.moving.up) 
            {
                if(walls.top.solid == 1) {
                    
                    this.position.y = (location.top + 1.1) * level.wall.height + this.r;
                    this.canJump = false;
                    this.velocity.y = 0;
                    this.moving.up = false;
                    
                    
                }
                
            }
        }
        
        if(
            (this.moving.up && this.moving.right && walls.right.solid == 1) ||
            (this.moving.up && this.moving.left && walls.left.solid == 1)
            )
            {

             
                this.moving.up = false;
            }

        if(
            (walls.topLeft.solid == 1 && walls.top.solid == 0 && walls.topRight.solid == 0 ) || 
            (walls.topLeft.solid == 0 && walls.top.solid == 0 && walls.topRight.solid == 1 ) 
        )
        {
            if(this.moving.up)
            {     
               
                this.canJump = false;
                this.velocity.y = 0;
                this.velocity.x = 0;
                this.moving.up = false;
            }
            
        }
        
      
     
        if(
            (walls.bottomLeft.solid == 0 && walls.bottom.solid == 1 && walls.bottomRight.solid == 0 ) ||
            (walls.bottomLeft.solid == 1 && walls.bottom.solid == 1 && walls.bottomRight.solid == 0 ) ||
            (walls.bottomLeft.solid == 0 && walls.bottom.solid == 1 && walls.bottomRight.solid == 1 ) ||
            (walls.bottomLeft.solid == 1 && walls.bottom.solid == 1 && walls.bottomRight.solid == 1 ) 
            ) {
            if(this.position.y > oldPosition.y) {
                this.position.y = (location.bottom - 0.9) * level.wall.height + this.r;
                this.canJump = true;
                this.fallingCounter = 1;
            }   
            

        }
        
      

        if (
            (walls.bottomLeft.solid == 1 && walls.bottom.solid == 0 && walls.bottomRight.solid == 0 ) ||
            (walls.bottomLeft.solid == 0 && walls.bottom.solid == 0 && walls.bottomRight.solid == 1 ) 
     
        ) { 
            if(this.moving.left || this.moving.right) 
            {

            }

            else if(this.position.y > oldPosition.y) {
                this.position.y = (location.bottom - 0.9) * level.wall.height + this.r;
                this.fallingCounter = 1;
                this.canJump = true;
            }
        }
        
    }
        
      
    

    startMoving(key, context) {
        switch(key) {
            case 37:
                this.moving.left = true;
                break;
            case 38:
                if(this.canJump) {
                    if(!this.moving.up) {
                    this.fallingCounter = 1;
                    this.moving.up = true;
                    this.canJump = false;
                    }

                }
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