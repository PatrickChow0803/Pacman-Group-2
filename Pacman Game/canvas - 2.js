/***
 * Canvas for basic pacman movement. 
 * When the user hits an arrow key, the "pacman"
 * moves in that direction until it hits the edge of the canvas
 * The pacman stops moving when it hits the edges of the canvas 
 * or the user hits a different arrow key 
 * @author Luanna Polanco, Ruslan Pantaev, Anastasia Miyagkii, Patrick Chow, Steven Hulse
 ***/


var canvas = document.getElementById('pacman-canvas');
var ctx = canvas.getContext('2d');


// RP start -------------------------------------------------------------------------
// combined Luanna and Patrick's code for player movement

// const start -------------------------------------

var WALL_THICKNESS = 15;
var PACMAN_RADIUS = WALL_THICKNESS * 1.5;
var TO_RADIANS = Math.PI / 180; // const coefficient to rotate angle by

var pills = [{
    x: 50,
    y: 40
}, {
    x: 50,
    y: 360
}];

function drawPills() {
    /*for (var i = 0; i < pills.length; i++) {
        var pill = pills[i];


    }*/

    for (var y = 10; y < 300; y += 10) {
        for (var x = 10; x < 500; x += 10) {

        }
    }
}

// const end ---------------------------------------

// init start --------------------------------------
//pinky position and direction
var px = 600;
var py = 360;
var pDirection = 'left';

//blinky position and direction
bx = 50;//290
by = 40;//145
bDirection = 'left';

//inky position and direction
ix = 50;
iy = 360;
iDirection = 'right';

//clyde position and direction
cx = 600;
cy = 40;
cDirection = 'up';

//pacman initial values
xPos = 320;
yPos = 255;
direction = 'left';
directionAngle = 180;
speedInterval = 60; // lower numbers are faster
ghostIndex = 0;
pacmanIndex = 0; // which png/sprite are we on?
isPacmanIndexUpdated = false; // animation speed fix (halves it)
pacLives = 3;


pacmanSrc = new Array(5); // contains file paths for pacman sprites
initPacmanSrc();

PinkySrc = new Array(2);
initPinkySrc();

BinkySrc = new Array(2);
initBinkySrc();

InkySrc = new Array(2);
initInkySrc();

ClydeSrc = new Array(2);
initClydeSrc();

function initPacmanSrc() {
    for (i = 0; i < 5; i++) {
        pacmanSrc[i] = "assets/pacman/pac_man_" + i + ".png";
    }
}
function initPinkySrc() {
    for (i = 0; i < 2; i++) {
        PinkySrc[i] = "assets/ghosts/pink_ghost/spr_ghost_pink_" + i + ".png";
    }
}
function initBinkySrc() {
    for (i = 0; i < 2; i++) {
        BinkySrc[i] = "assets/ghosts/red_ghost/spr_ghost_red_" + i + ".png";
    }
}
function initInkySrc() {
    for (i = 0; i < 2; i++) {
        InkySrc[i] = "assets/ghosts/blue_ghost/spr_ghost_blue_" + i + ".png";
    }
}
function initClydeSrc() {
    for (i = 0; i < 2; i++) {
        ClydeSrc[i] = "assets/ghosts/orange_ghost/spr_ghost_orange_" + i + ".png";
    }
}

// init end ----------------------------------------

// player controls start ---------------------------

window.addEventListener("keyup", changeState, false); // bug fix to prevent "accelerated input"
var movePacmanI;
var moveGhostsI;
var isWallI;
//starts game 
function startGame() {
    movePacmanI = setInterval(movePacman, speedInterval);
    moveGhostsI = setInterval(moveGhosts, speedInterval);
    isWallI = setInterval(isWall, speedInterval / 2);
}

startGame();
//ends game
function stopGame() {
    clearInterval(movePacmanI);
    clearInterval(moveGhostsI);
}

//pauses game when user presses spacebar
paused = false;
function pauseGame() {
    if (!paused) {
        paused = true;
        stopGame();
    } else {
        paused = false;
        startGame();
    }
}

window.addEventListener("keydown", function (e) {
    key = e.keyCode;
    if (key == 32) {
        pauseGame();
    }
});

/* Start Code by Steven GhostsAPI have different personalities
 * Red ghost blinky Goes right after Pacman 
 * Pink ghosts moves unpredictably
 * orange ghost tries to stay away from red ghost as hes the scared one but also trying to trap pacman
 * blue ghost is randomized 
 */
function moveGhosts() {
    var ghosts = [
        'p',
        'b',
        'i',
        'c'
    ];

    for (var i = 0; i < 4; i++) {
        var ghost = ghosts[i];
        var x = window[ghost + 'x'];
        var y = window[ghost + 'y'];
        var position = {
            x: x,
            y: y
        };
        var direction = window[ghost + 'Direction'];
        var directions = [
            'right',
            'left',
            'up',
            'down'
        ];

        // Blue ghost - random direction
        if (ghost === 'i' && isWallGhost(position, direction)) {
            do {
                direction = directions[
                    Math.floor(Math.random() * 4)
                ];
            } while (isWallGhost(position, direction))
        }

        // Orange ghost - avoids red one
        if (ghost === 'c') {
            var blinkyPosition = {
                x: bx,
                y: by
            };

            function shuffle(arr) {
                arr.sort(function (value) {
                    return Math.random() > .5 ? 1 : -1;
                });

                return arr;
            }

            function changeDir(position, avoid) {
                var dirs = shuffle(directions).filter(function (dir) {
                    return dir !== avoid;
                });

                for (var i = 0; i < dirs.length; i++) {
                    direction = dirs[i];
                    if (!isWallGhost(position, direction)) {
                        break;
                    }
                }

                return direction;
            }

            switch (direction) {
                case 'down':
                    if (Math.abs(position.y - blinkyPosition.y) < PACMAN_RADIUS / 2 || isWallGhost(position, direction)) {
                        direction = changeDir(position, 'down');
                    }
                    break;

                case 'up':
                    if (Math.abs(position.y - blinkyPosition.y) < PACMAN_RADIUS / 2 || isWallGhost(position, direction)) {
                        direction = changeDir(position, 'up');
                    }
                    break;

                case 'left':
                    if (Math.abs(position.x - blinkyPosition.x) < PACMAN_RADIUS / 2 || isWallGhost(position, direction)) {
                        direction = changeDir(position, 'left');
                    }
                    break;

                case 'right':
                    if (Math.abs(position.x - blinkyPosition.x) < PACMAN_RADIUS / 2 || isWallGhost(position, direction)) {
                        direction = changeDir(position, 'right');
                    }
                    break;
            }
        }

        // Red ghost and Pinky 
        if (ghost === 'b' || (ghost === 'p' && isWallGhost(position, direction))) {
            if (xPos > x && !isWallGhost(position, 'right')) {
                direction = 'right';
            } else if (xPos < x && !isWallGhost(position, 'left')) {
                direction = 'left';
            } else if (yPos > y && !isWallGhost(position, 'down')) {
                direction = 'down';
            } else {
                direction = 'up';
            }
        }

        switch (direction) {
            case 'up':
                window[ghost + 'y'] -= 5;
                break;
            case 'down':
                window[ghost + 'y'] += 5;
                break;
            case 'right':
                window[ghost + 'x'] += 5;
                break;
            case 'left':
                window[ghost + 'x'] -= 5;
                break;
        }

        // Updates direction
        window[ghost + 'Direction'] = direction;

        /* checks for game state: if a ghosts touches pacman, he loses a life and the game starts over
         * once he loses all 3 lives, the game is over
         */
        if (
            Math.abs(window[ghost + 'x'] - xPos) < PACMAN_RADIUS / 2 &&
            Math.abs(window[ghost + 'y'] - yPos) < PACMAN_RADIUS / 2
        ) {
            pacLives--;
            resetCharacterPosition();
            if (pacLives == 0) {
                stopGame();
                alert('Game Over');
            }
        }
    }
}
/* this function resets all of the characters to their original starting positions */
function resetCharacterPosition() {
    px = 600;
    py = 360;
    pDirection = 'left';

    bx = 50;//290
    by = 40;//145
    bDirection = 'left';

    ix = 50;
    iy = 360;
    iDirection = 'right';

    cx = 600;
    cy = 40;
    cDirection = 'up';

    xPos = 320;
    yPos = 255;
    direction = 'left';
    directionAngle = 180;
}

function changeState(event) {
    switch (event.keyCode) {
        case 37:
            direction = 'left';
            directionAngle = 180;
            break;
        case 39:
            direction = 'right';
            directionAngle = 0;
            break;
        case 38:
            direction = 'up';
            directionAngle = 270;
            break;
        case 40:
            direction = 'down';
            directionAngle = 90;
            break;
    }
    event.preventDefault(); // prevent any action(s) from happening w/out our explicit instructions
}

function movePacman() {
	/*
	 * this is where the sprite animation takes place
	 * we cycle through the 5 pngs
	 * note: due to the speed setting, the animation was too quick.
	 * a quick solution was to use the bool <isPacmanIndexUpdated>
	 * to cut the animation cycle in half
	 */
    if (!isPacmanIndexUpdated) {
        pacmanIndex = (pacmanIndex + 1) % 5;
        isPacmanIndexUpdated = true;
    }
    else {
        isPacmanIndexUpdated = false;
    }

    if (!isWall()) {
        if (direction == 'right') {
            if (xPos < canvas.width - 20) { xPos += 5; }
        }
        if (direction == 'left') {
            if (xPos > 20) { xPos -= 5; }
        }
        if (direction == 'up') {
            if (yPos > 20) { yPos -= 5; }
        }
        if (direction == 'down') {
            if (yPos < canvas.height - 20) { yPos += 5; }
        }
    }

    clearCanvas();
    pacMan = document.createElement("img"); // create new img object
    pacMan.src = pacmanSrc[pacmanIndex]; // set img file path
    clearCanvas();
    binky = document.createElement("img");
    binky.src = BinkySrc[ghostIndex];
    clearCanvas();
    inky = document.createElement("img");
    inky.src = InkySrc[ghostIndex];
    clearCanvas();
    pinky = document.createElement("img");
    pinky.src = PinkySrc[ghostIndex];
    clearCanvas();
    clyde = document.createElement("img");
    clyde.src = ClydeSrc[ghostIndex];
	/*
	 * save current canvas context,
	 * set x,y coords,
	 * rotate it,
	 * draw img,
	 * then restore from previous saved state
	 * the result is that the img is now rotated but the canvas is back to normal
	 */

    //pacman
    ctx.save();
    ctx.translate(xPos, yPos);
    ctx.rotate(directionAngle * TO_RADIANS);
    ctx.drawImage(pacMan, -(pacMan.width / 2), -(pacMan.height / 2));
    ctx.restore();

    //binky
    ctx.save();
    ctx.translate(bx, by);
    ctx.drawImage(binky, -(binky.width / 2), -(binky.height / 2));
    ctx.restore();

    //pinky
    ctx.save();
    ctx.translate(px, py);
    ctx.drawImage(pinky, -(pinky.width / 2), -(pinky.height / 2));
    ctx.restore();

    //inky
    ctx.save();
    ctx.translate(ix, iy);
    ctx.drawImage(inky, -(inky.width / 2), -(inky.height / 2));
    ctx.restore();

    //clyde
    ctx.save();
    ctx.translate(cx, cy);
    ctx.drawImage(clyde, -(clyde.width / 2), -(clyde.height / 2));
    ctx.restore();
}

// player controls end -----------------------------

// walls start -------------------------------------

/*
 * create background canvas to draw walls
 * this gives us two layers of canvases
 * we only render the maze/walls once and do not unnecessarily rerender
 * (one for player/characters/objects
 * another for level walls)
 */
bgCanvas = document.getElementById('bg-canvas');
bgCtx = bgCanvas.getContext("2d");

walls = [];

// think of this as a class
function Wall(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.show = function () {

        bgCtx.shadowColor = 'white';
        bgCtx.shadowBlur = 3;

        bgCtx.beginPath();
        bgCtx.fillStyle = '#B22222';
        bgCtx.fillRect(this.x, this.y, this.width, this.height);

    }
}

/*
 * this is where we draw the walls
 * the advantage to this design is that we now have an array <walls>
 * which we can refer to, to make sure pacman can't walk through there
 */
function initWalls() {
    /*walls = [
        new Wall(0, 0, canvas.width, WALL_THICKNESS),
        new Wall(0, 0, WALL_THICKNESS, canvas.height,
        ...
    ]*/

    //surrounding border
    walls[0] = new Wall(0, 0, canvas.width, WALL_THICKNESS);
    walls[1] = new Wall(0, 0, WALL_THICKNESS, canvas.height);
    walls[2] = new Wall(0, 385, canvas.width, WALL_THICKNESS);
    walls[3] = new Wall(630, 0, WALL_THICKNESS, canvas.height);

    //ghost spawn area
    walls[4] = new Wall(null, null, WALL_THICKNESS, null);//left
    walls[5] = new Wall(210, 220, 220, WALL_THICKNESS);//bottom
    walls[6] = new Wall(null, null, WALL_THICKNESS, null);//right
    walls[7] = new Wall(355, 165, 60, WALL_THICKNESS);//top left
    walls[8] = new Wall(225, 165, 60, WALL_THICKNESS);//top right

    //upright T shapes
    walls[9] = new Wall(310, 75, WALL_THICKNESS, 50);
    walls[10] = new Wall(210, 60, walls[5].width, WALL_THICKNESS);
    walls[11] = new Wall(310, 290, WALL_THICKNESS, 50);
    walls[12] = new Wall(210, 275, walls[5].width, WALL_THICKNESS);

    //left rotated T
    walls[13] = new Wall(140, 60, WALL_THICKNESS, 115);
    walls[14] = new Wall(155, 110, 105, WALL_THICKNESS);

    //singular short walls
    walls[15] = new Wall(140, 220, WALL_THICKNESS, 70);
    walls[16] = new Wall(140, 325, 130, WALL_THICKNESS);
    walls[17] = new Wall(370, 325, 130, WALL_THICKNESS);
    walls[18] = new Wall(485, 220, WALL_THICKNESS, 70);

    //right rotated T
    walls[19] = new Wall(485, 60, WALL_THICKNESS, 115);
    walls[20] = new Wall(375, 110, 110, WALL_THICKNESS);

    //upper left F shape
    walls[21] = new Wall(85, 60, WALL_THICKNESS, 115);
    walls[22] = new Wall(50, 120, 35, WALL_THICKNESS);
    walls[23] = new Wall(55, 60, 45, WALL_THICKNESS);

    //lower left F shape
    walls[24] = new Wall(85, 220, WALL_THICKNESS, 115);
    walls[25] = new Wall(50, 260, 35, WALL_THICKNESS);
    walls[26] = new Wall(55, 320, 45, WALL_THICKNESS);

    //upper right F shape
    walls[27] = new Wall(545, 60, WALL_THICKNESS, 115);
    walls[28] = new Wall(560, 60, 35, WALL_THICKNESS);
    walls[29] = new Wall(560, 120, 35, WALL_THICKNESS);

    //lower right F shape
    walls[30] = new Wall(545, 220, WALL_THICKNESS, 115);
    walls[31] = new Wall(550, 320, 45, WALL_THICKNESS);
    walls[32] = new Wall(560, 260, 35, WALL_THICKNESS);
}

/*
 * forEach wall object, call its show() method
 * this renders it on the bgCanvas
 */
function renderWalls() {
    walls.forEach(function (wall, i) {
        wall.show();
    })
}

/*
 * refer to the walls array and return true if player is in wall area
 */
function isWall() {
    for (var i = 0; i < walls.length; i++) {
        var xOffset = 0;
        var yOffset = 0;
        var xRadiusOffset = 0;
        var yRadiusOffset = 0;

        if (direction == 'right') {
            xOffset += 5;
            xRadiusOffset += PACMAN_RADIUS;
        }
        if (direction == 'left') {
            xOffset += -5;
            xRadiusOffset -= PACMAN_RADIUS;
        }
        if (direction == 'up') {
            yOffset += -5;
            yRadiusOffset -= PACMAN_RADIUS;
        }
        if (direction == 'down') {
            yOffset += 5;
            yRadiusOffset += PACMAN_RADIUS;
        }

        // note: I am directly setting the isWallBool variable so that the movePacman method
        // can access it properly
        // this is a workaround due to the update/setInterval design pattern

        var xFuture = xPos + xOffset + xRadiusOffset;
        var yFuture = yPos + yOffset + yRadiusOffset;

        if ((xFuture <= (walls[i].x + walls[i].width) && xFuture >= walls[i].x) &&
            (yFuture <= (walls[i].y + walls[i].height) && yFuture >= walls[i].y)) {
            return true;
        }
    }

    return false;
}
function isWallGhost(position, direction) {
    for (var i = 0; i < walls.length; i++) {
        var xOffset = 0;
        var yOffset = 0;
        var xRadiusOffset = 0;
        var yRadiusOffset = 0;

        if (direction == 'right') {
            xOffset += 5;
            xRadiusOffset += PACMAN_RADIUS;
        }
        if (direction == 'left') {
            xOffset += -5;
            xRadiusOffset -= PACMAN_RADIUS;
        }
        if (direction == 'up') {
            yOffset += -5;
            yRadiusOffset -= PACMAN_RADIUS;
        }
        if (direction == 'down') {
            yOffset += 5;
            yRadiusOffset += PACMAN_RADIUS;
        }

        // note: I am directly setting the isWallBool variable so that the movePacman method
        // can access it properly
        // this is a workaround due to the update/setInterval design pattern

        var xFuture = position.x + xOffset + xRadiusOffset;
        var yFuture = position.y + yOffset + yRadiusOffset;

        if ((xFuture <= (walls[i].x + walls[i].width) && xFuture >= walls[i].x) &&
            (yFuture <= (walls[i].y + walls[i].height) && yFuture >= walls[i].y)) {
            // console.log("hit a wall");
            return true;
            // break; // important bug fix
        } else {
            // console.log("no wall");
        }
    }

    return false;
}
initWalls();
renderWalls();

// walls end ---------------------------------------

// RP end -----------------------------------------------------------------------------

// clears canvas for redrawing
// note: does not clear the bgCanvas
function clearCanvas() {
    canvas.width = canvas.width;
}

//Plays music with a 100 ms delay.
setTimeout(function () {
    //document.getElementById("main_audio").play();
}, 100)