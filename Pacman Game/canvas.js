/***
 * Group 2 BC PACMAN 
 * CISC 3140 Design & Implementation of Web Apps 2
 * Canvas for basic pacman movement. 
 * When the user hits an arrow key, the "pacman"
 * moves in that direction until it hits the edge of the canvas
 * The pacman stops moving in that direction when it hits the edges of the canvas 
 * or the user hits a different arrow key 
 * @author Luanna Polanco, Ruslan Pantaev, Anastasia Miyagkii, Patrick Chow, Steven Hulse
 ***/

canvas = document.getElementById('pacman-canvas');
ctx = canvas.getContext('2d');


// RP start -------------------------------------------------------------------------
// combined Luanna and Patrick's code for player movement

// const start -------------------------------------

WALL_THICKNESS = 15;
PACMAN_RADIUS = WALL_THICKNESS;
TO_RADIANS = Math.PI / 180; // const coefficient to rotate angle by
PAC_PILL = 1;
PILL_RADIUS = 5;

// const end ---------------------------------------

// init start --------------------------------------
//pinky position and direction
px = 600;
py = 360;
pDirection = 'left';

//blinky position and direction
bx = 50;
by = 40;
bDirection = 'right';

//inky position and direction
ix = 50;
iy = 360;
iDirection = 'left';

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
score = 0;


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

var leftTeleport = {
    x: 0,
    y: 200,
    direction: 'right'
};
var rightTeleport = {
    x: 645,
    y: 200,
    direction: 'left'
};

var topTeleport = {
    x: 320,
    y: 0,
    direction: 'down'
};
var bottomTeleport = {
    x: 320,
    y: 400,
    direction: 'up'
};

leftTeleport.port = rightTeleport;
rightTeleport.port = leftTeleport;
bottomTeleport.port = topTeleport;
topTeleport.port = bottomTeleport;

var teleports = [
    leftTeleport,
    rightTeleport,
    topTeleport,
    bottomTeleport
];

function renderTeleports() {
    teleports.forEach(function (teleport) {
        var width = teleport.direction === 'right' || teleport.direction === 'left' ? 30 : 50;
        var height = teleport.direction === 'right' || teleport.direction === 'left' ? 50 : 30;
        bgCtx.beginPath();
        bgCtx.fillStyle = '#C0C';
        bgCtx.fillRect(teleport.x - width / 2, teleport.y - height / 2, width, height);
    });
}

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

            var blood = document.querySelector('img.blood');
            var pauseTime = 2000; // 2 seconds

            // Shows the blood    
            blood.style.display = 'block';

            if (pacLives == 0) {
                stopGame();
                alert("Game Over \n Score: " + score);
                window.open("menu.html", "_self");
            } else if (score == pills.length){
                stopGame();
                alert("You won!");
            } else {
                // Pause game for a few seconds
                pauseGame();
                setTimeout(function () {
                    pauseGame();
                }, pauseTime);
            }

            // Hides blood
            setTimeout(function () {
                blood.style.display = 'none';
            }, pauseTime);
        }
    }
}
/* this function resets all of the characters to their original starting positions */
function resetCharacterPosition() {
    px = 600;
    py = 360;
    pDirection = 'left';

    bx = 50;
    by = 40;
    bDirection = 'right';

    ix = 50;
    iy = 360;
    iDirection = 'left';

    cx = 600;
    cy = 40;
    cDirection = 'up';

    xPos = 320;
    yPos = 255;
    direction = 'right';
    directionAngle = 0;
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

    teleports.forEach(function (teleport) {
        if (direction === teleport.port.direction && // moving to the teleport
            Math.abs(xPos - teleport.x) < 50 && Math.abs(yPos - teleport.y) < 50 // close enough
        ) {
            console.log('found')
            xPos = teleport.port.x;
            yPos = teleport.port.y;
            direction = teleport.port.direction;
        }
    });

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

    // Check for pill eat
    var distance = PACMAN_RADIUS + 5;
    pills.forEach(function (pill) {
        if (Math.abs(xPos - pill.x) < distance && Math.abs(yPos - pill.y) < distance && pill.visible) {
            pill.visible = false;
            score+=PAC_PILL; 
        }
    });

    clearCanvas();
    pacMan = document.createElement("img"); // create new img object
    pacMan.src = pacmanSrc[pacmanIndex]; // set img file path

    binky = document.createElement("img");
    binky.src = BinkySrc[ghostIndex];

    inky = document.createElement("img");
    inky.src = InkySrc[ghostIndex];

    pinky = document.createElement("img");
    pinky.src = PinkySrc[ghostIndex];

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
    showStats();

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

    // pills
    renderPills();
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
    //surrounding border
    walls[0] = new Wall(0, 0, canvas.width, WALL_THICKNESS);
    walls[1] = new Wall(0, 0, WALL_THICKNESS, canvas.height);
    walls[2] = new Wall(0, 385, canvas.width, WALL_THICKNESS);
    walls[3] = new Wall(630, 0, WALL_THICKNESS, canvas.height);

    //ghost spawn area
    walls[4] = new Wall(null, null, WALL_THICKNESS, null);//left
    walls[5] = new Wall(220, 180, 200, 60);//bottom
    walls[6] = new Wall(null, null, WALL_THICKNESS, null);//right
    walls[7] = new Wall(null, null, 60, WALL_THICKNESS);//top left
    walls[8] = new Wall(null, null, 60, WALL_THICKNESS);//top right

    //upright T shapes
    walls[9] = new Wall(310, 75, WALL_THICKNESS, 50);
    walls[10] = new Wall(220, 60, walls[5].width, WALL_THICKNESS);
    walls[11] = new Wall(310, 290, WALL_THICKNESS, 50);
    walls[12] = new Wall(220, 275, walls[5].width, WALL_THICKNESS);

    //left rotated T
    walls[13] = new Wall(140, 60, 30, 100);
    walls[14] = new Wall(170, 120, 90, WALL_THICKNESS);

    //singular short walls
    walls[15] = new Wall(140, 220, 30, 70);
    walls[16] = new Wall(140, 325, 130, WALL_THICKNESS);
    walls[17] = new Wall(370, 325, 130, WALL_THICKNESS);
    walls[18] = new Wall(475, 220, 30, 70);

    //right rotated T
    walls[19] = new Wall(475, 60, 30, 100);
    walls[20] = new Wall(375, 120, 100, WALL_THICKNESS);

    //upper left block
    walls[21] = new Wall(60, 60, 36, 100);

    //lower left block
    walls[22] = new Wall(60, 220, 36, 120);

    //upper right block
    walls[23] = new Wall(545, 60, 36, 100);

    //lower right block
    walls[24] = new Wall(545, 220, 36, 120);
}

function renderWalls() {
    walls.forEach(function (wall, i) {
        wall.show();
    })
}

/*
 * forEach wall object, call its show() method
 * this renders it on the bgCanvas
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

//ghost wall collision check
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

//pills start --------------------------------------
pills = [];
isActive = true;

function Pill(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = '#FFFFFF';
    this.visible = true;

    this.show = function () {
        bgCtx.beginPath();
        bgCtx.fillStyle = this.visible ? this.color : 'rgb(0,255,0)';;
        bgCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        bgCtx.fill();
    }
}

function initPills() {
    //top
    xPill = 0;
    yPill = 40;
    for (i = 0; i < 15; i++) {
        xPill += 40;
        pills[i] = new Pill(xPill, yPill, PILL_RADIUS);
    }

    //bottom
    xPill = 0;
    yPill = 360;
    for (i = 15; i < 30; i++) {
        xPill += 40;
        pills[i] = new Pill(xPill, yPill, PILL_RADIUS);
    }

    pills[30] = new Pill(40, 90, PILL_RADIUS);
    pills[31] = new Pill(120, 90, PILL_RADIUS);
    pills[32] = new Pill(200, 90, PILL_RADIUS);
    pills[33] = new Pill(240, 90, PILL_RADIUS);
    pills[34] = new Pill(280, 90, PILL_RADIUS);
    pills[35] = new Pill(360, 90, PILL_RADIUS);
    pills[36] = new Pill(400, 90, PILL_RADIUS);
    pills[37] = new Pill(440, 90, PILL_RADIUS);
    pills[38] = new Pill(520, 90, PILL_RADIUS);
    pills[39] = new Pill(600, 90, PILL_RADIUS);

    pills[40] = new Pill(40, 150, PILL_RADIUS);
    pills[41] = new Pill(120, 150, PILL_RADIUS);
    pills[42] = new Pill(200, 150, PILL_RADIUS);
    pills[43] = new Pill(240, 150, PILL_RADIUS);
    pills[44] = new Pill(280, 150, PILL_RADIUS);
    pills[45] = new Pill(320, 150, PILL_RADIUS);
    pills[46] = new Pill(360, 150, PILL_RADIUS);
    pills[47] = new Pill(400, 150, PILL_RADIUS);
    pills[48] = new Pill(440, 150, PILL_RADIUS);
    pills[49] = new Pill(520, 150, PILL_RADIUS);
    pills[50] = new Pill(600, 150, PILL_RADIUS);

    pills[51] = new Pill(40, 200, PILL_RADIUS);
    pills[52] = new Pill(80, 200, PILL_RADIUS);
    pills[53] = new Pill(120, 200, PILL_RADIUS);
    pills[54] = new Pill(160, 200, PILL_RADIUS);
    pills[55] = new Pill(200, 200, PILL_RADIUS);
    pills[56] = new Pill(440, 200, PILL_RADIUS);
    pills[57] = new Pill(480, 200, PILL_RADIUS);
    pills[58] = new Pill(520, 200, PILL_RADIUS);
    pills[59] = new Pill(560, 200, PILL_RADIUS);
    pills[60] = new Pill(600, 200, PILL_RADIUS);

    pills[61] = new Pill(40, 260, PILL_RADIUS);
    pills[62] = new Pill(120, 260, PILL_RADIUS);

    xPill = 200;
    yPill = 260;
    pills[63] = new Pill(xPill, yPill, PILL_RADIUS);
    for (i = 64; i < 70; i++) {
        xPill += 40;
        pills[i] = new Pill(xPill, yPill, PILL_RADIUS)
    }

    pills[70] = new Pill(520, 260, PILL_RADIUS);
    pills[71] = new Pill(600, 260, PILL_RADIUS);

    pills[72] = new Pill(40, 310, PILL_RADIUS);

    xPill = 120;
    yPill = 310;
    pills[73] = new Pill(xPill, yPill, PILL_RADIUS);
    for (i = 74; i < 78; i++) {
        xPill += 40;
        pills[i] = new Pill(xPill, yPill, PILL_RADIUS);
    }

    xPill = 360;
    yPill = 310;
    pills[78] = new Pill(xPill, yPill, PILL_RADIUS);
    for (i = 79; i < 83; i++) {
        xPill += 40;
        pills[i] = new Pill(xPill, yPill, PILL_RADIUS);
    }

    pills[84] = new Pill(600, 310, PILL_RADIUS);
}

function renderPills() {
    // bgCtx
    pills.forEach(function (pill) {
        pill.show();
    })
}


initPills();
renderPills();
renderTeleports();


//pills end ----------------------------------------

statsCanvas = document.getElementById("stats-canvas");
stCtx = statsCanvas.getContext("2d");

function showStats(){
  stCtx.font = "15px sans-serif";
  stCtx.clearRect(0, 0, statsCanvas.width, statsCanvas.height);
  stCtx.fillText("Score: " + score, 20, 40)
  stCtx.fillText("Lives Left: " + (pacLives-1), 20, 90);
}

// clears canvas for redrawing
// note: does not clear the bgCanvas
function clearCanvas() {
    canvas.width = canvas.width;
}

//Plays music with a 100 ms delay.
setTimeout(function () {
    //document.getElementById("main_audio").play();
}, 100)