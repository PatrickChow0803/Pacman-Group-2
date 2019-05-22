// For ref only, not in use

/**
 * Build basic test map for pacman
 * @author ejfranco06@gmail.com (Emilio J. Franco)
 */
 
function buildMap() {
  const canvas = document.getElementById('blackboard');
  const ctx = canvas.getContext('2d');

  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#063d96";
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  outerWalls(ctx, 0, 0, canvas.width, canvas.height);
   obstacleBlocks(ctx);

  // tBlock(ctx, 50, 50, 100, 100);

  // TBlock(ctx, 50, 50,400, 160, 45);
  // crossBlock(ctx, 50, 50, 100, 100, 10);
  // LBlock(ctx, 40, 40, 120, 120, 10);
  
  // roundedRect(ctx, 50, 300, 10, 10, 10);
  // ctx.fillStyle = "#FF0000";
  // ctx.fillRect(40, 40, 40, 40);
  ctx.restore();

  
}

function obstacleBlocks(ctx) {
  ctx.save();
  //top row
  roundedRect(ctx, 58, 58, 245, 80, 10);
  roundedRect(ctx, 343, 58, 245, 80, 10);

  //left bottom row 
  roundedRect(ctx, 58, 178, 125, 167, 10);
  roundedRect(ctx, 223, 178, 40, 167, 10);

  //middle bottom 
  roundedRect(ctx, 303, 178, 40, 127, 10);
  roundedRect(ctx, 303, 345, 40, 40, 10);

  //right bottom 
  roundedRect(ctx, 383, 178, 40, 167, 10);
  roundedRect(ctx, 463, 178, 125, 167, 10);
  ctx.restore();

}

/**
 * Create the maps outer walls
 * @author ejfranco06@gmail.com (Emilio J. Franco)
 * @param {object} ctx Canvas context
 * @param {number} canvasWidth Canvas width
 * @param {number} canvasHeight Canvas Height
 */
function outerWalls(ctx, x, y, canvasWidth, canvasHeight) {
  roundedRect(ctx, x + 4, y + 4, canvasWidth - 8, canvasHeight - 8, 10);
  roundedRect(ctx, x + 14, y + 14, canvasWidth - 28, canvasHeight - 28, 10);
}


/**
 * Draw a rounded edge rectangle
 * @param {object} ctx  Canvas context
 * @param {number} x Starting x postion of top left corner
 * @param {number} y Starting y position of top left corner
 * @param {number} width The width of the rectangle
 * @param {number} height The height of the the rectangle
 * @param {number} radius The radius of the corners
 */
function roundedRect(ctx, x, y, width, height, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.stroke();
  ctx.restore();
}


/**
 * Draw a two vertical pipes seperated by width
 * @author ejfranco06@gmail.com (Emilio J. Franco)
 * @param {object} ctx Canvas context
 * @param {number} x Starting x postion of top left corner
 * @param {number} y Starting y position of top left corner
 * @param {number} width The seperation of the two pipes
 * @param {number} length The length given to each one
 */
function openPipeVertical(ctx, x, y, width, length) {
  let spaceBetween = width - 2;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + length);
  ctx.moveTo(x + spaceBetween, y);
  ctx.lineTo(x + spaceBetween, y + length);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw a two horizontal pipes seperated by width
 * @author ejfranco06@gmail.com (Emilio J. Franco)
 * @param {object} ctx Canvas context
 * @param {number} x Starting x postion of top left corner
 * @param {number} y Starting y position of top left corner
 * @param {number} width The seperation of the two pipes
 * @param {number} length The length given to each one
 */
function openPipeHorizontal(ctx, x, y, width, length) {
  let spaceBetween = width - 2;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + length, y);
  ctx.moveTo(x, y + spaceBetween);
  ctx.lineTo(x + length, y + spaceBetween);
  ctx.stroke();
  ctx.restore();
}


//Experimental still working on it don't use
//@author ejfranco06@gmail.com (Emilio J. Franco)
function openCornerNW(ctx, x, y, arc) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arcTo(x, y - arc, x + arc, y - arc, arc);
  ctx.stroke();
  ctx.restore();
}

//Experimental still working on it don't use
//@author ejfranco06@gmail.com  (Emilio J. Franco)
function openCornerNE(ctx, x, y, arc) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arcTo(x + arc, y, x + arc, y + arc, arc);
  ctx.stroke();
  ctx.restore();
}

function TBlock(ctx, x, y, width, height, gap)
{
  ctx.save(); 
  ctx.beginPath();
  ctx.moveTo(x + gap, y);
  
  ctx.arc(x + width - gap, y + gap, gap, 1.5 * Math.PI, Math.PI / 2); //top + right curve
  ctx.arcTo(x + width / 2 + gap, y + 2 * gap, x + width / 2 + gap, y + 2 * gap + 2, 2); // horizontal bottom right + curve to bottom
  ctx.arc(x + width / 2, y + height - gap, gap, 0, Math.PI); // bottom vertical right + bottom curve
  ctx.arcTo(x + width / 2 - gap, y + 2 * gap, x + width / 2 - gap, y + 2 * gap - 2, 2); //bottom vertical left + bottom left curve
  ctx.arc(x + gap, y + gap, gap, Math.PI / 2, 1.5 * Math.PI); //left curve

  gap /= 2;
  height -= gap;

  ctx.moveTo(x + gap * 2, y + gap);
  
  ctx.arc(x + width - 2 * gap, y + 2 * gap, gap, 1.5 * Math.PI, Math.PI / 2); //top + right curve
  ctx.arcTo(x + width / 2 + gap, y + 3 * gap, x + width / 2 + gap, y + 3 * gap + 2, 2); // horizontal bottom right + curve to bottom
  ctx.arc(x + width / 2, y + height - gap, gap, 0, Math.PI); // bottom vertical right + bottom curve
  ctx.arcTo(x + width / 2 - gap, y + 3 * gap, x + width / 2 - gap, y + 3 * gap - 2, 2); //bottom vertical left + bottom left curve
  ctx.arc(x + 2 * gap, y + 2 * gap, gap, Math.PI / 2, 1.5 * Math.PI); //left curve

  ctx.stroke(); 
  ctx.restore();  
}

//gap must be at least 4x smaller than width and height
function crossBlock(ctx, x, y, width, height, gap)
{
  ctx.save(); 
  ctx.beginPath();

  ctx.arc(x + width / 2, y + gap, gap, Math.PI, 0); //top curve
  ctx.arcTo(x + width / 2 + gap, y + height / 2 - gap, x + width / 2 + gap + 2, y + height / 2 - gap, 2); //top right curve 
  ctx.arc(x + width - gap, y + height / 2, gap, 1.5 * Math.PI, Math.PI / 2); // right curve
  ctx.arcTo(x + width / 2 + gap, y + height / 2 + gap, x + width / 2 + gap, y + height / 2 + gap + 2, 2); // lower right curve
  ctx.arc(x + width / 2, y + height - gap, gap, 0, Math.PI); // bottom curve
  ctx.arcTo(x + width / 2 - gap, y + height / 2 + gap, x + width / 2 - gap - 2, y + height / 2 + gap, 2); //lower left curve
  ctx.arc(x + gap, y + height / 2, gap, Math.PI / 2, 1.5 * Math.PI); // left curve
  ctx.arcTo(x + width / 2 - gap, y + height / 2 - gap, x + width / 2 - gap, y + height / 2 - gap - 2, 2); // top left curve
  ctx.lineTo(x + width / 2 - gap, y + gap);
  ctx.stroke();

  ctx.beginPath();

  gap /= 2;

  ctx.arc(x + width / 2, y + 2 * gap, gap, Math.PI, 0); //top curve
  ctx.arcTo(x + width / 2 + gap, y + height / 2 - gap, x + width / 2 + gap + 2, y + height / 2 - gap, 2); //top right curve 
  ctx.arc(x + width - 2 * gap, y + height / 2, gap, 1.5 * Math.PI, Math.PI / 2); // right curve
  ctx.arcTo(x + width / 2 + gap, y + height / 2 + gap, x + width / 2 + gap, y + height / 2 + gap + 2, 2); // lower right curve
  ctx.arc(x + width / 2, y + height - 2 * gap, gap, 0, Math.PI); // bottom curve
  ctx.arcTo(x + width / 2 - gap, y + height / 2 + gap, x + width / 2 - gap - 2, y + height / 2 + gap, 2); //lower left curve
  ctx.arc(x + gap * 2, y + height / 2, gap, Math.PI / 2, 1.5 * Math.PI); // left curve
  ctx.arcTo(x + width / 2 - gap, y + height / 2 - gap, x + width / 2 - gap, y + height / 2 - gap - 2, 2); // top left curve
  ctx.lineTo(x + width / 2 - gap, y + gap * 2);

  ctx.stroke(); 
  ctx.restore();  
}

//L shaped block - gap must be at least 3x less than width and height
function LBlock(ctx, x, y, width, height, gap)
{
  ctx.save(); 
  ctx.beginPath();

  ctx.arc(x + gap, y + gap, gap, Math.PI, 0); //top curve
  ctx.arcTo(x + 2 * gap, y + height - 2 * gap, x + 2 * gap + 2, y + height - 2 * gap, 2); //top right curve
  ctx.arc(x + width - gap, y + height - gap, gap, 1.5 * Math.PI, Math.PI / 2); // right curve
  ctx.arcTo(x, y + height, x, y + height - 2, gap); //bottom left curve
  ctx.lineTo(x, y + gap); // left

  ctx.stroke();
  ctx.beginPath();

  gap /= 2;

  ctx.arc(x + 2 * gap, y + 2 * gap, gap, Math.PI, 0); //top curve
  ctx.arcTo(x + 3 * gap, y + height - 3 * gap, x + 3 * gap + 2, y + height - 3 * gap, 2); //top right curve
  ctx.arc(x + width - 2 * gap, y + height - 2 * gap, gap, 1.5 * Math.PI, Math.PI / 2); // right curve
  ctx.arcTo(x + gap, y + height - gap, x + gap, y + height - gap - 2, gap); //bottom left curve
  ctx.lineTo(x + gap, y + 2 * gap); // left

  ctx.stroke();
  ctx.restore();
}


window.onload = buildMap;

// Patrick start -----------------------------------------------------

var xPos = 310;
var yPos = 21;

window.addEventListener("keyup", changeState, false);

var direction;
function changeState (event){
  switch(event.keyCode){
    case 37:
      direction = 'left';
      break;
    case 39:
      direction = 'right';
      break;
    case 38:
      direction = 'up';
      break;
    case 40:
      direction = 'down';
      break;
  }
  event.preventDefault();
}

function movePac(e){

  if (direction == 'right'){
    xPos +=5;
  }
  if (direction == 'left'){
    xPos-=5;
  }
  if (direction == 'up'){
    yPos -=5;
  }
  if (direction == 'down'){
    yPos +=5;
  }
  const canvas = document.getElementById('blackboard');
  const ctx = canvas.getContext('2d');

  canvas.width=canvas.width;
  // canvas.width = canvas.width;
  var pacMan = new Image();
  pacMan.src = "assets/pacman/pac_man_0.png";
  pacMan.addEventListener("load", function(){ctx.drawImage(pacMan,xPos,yPos)}, false);
   ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#063d96";
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  outerWalls(ctx, 0, 0, canvas.width, canvas.height);
   obstacleBlocks(ctx);

}

document.onkeydown = movePac;

setInterval(movePac,60);

// Patrick end -------------------------------------------------------