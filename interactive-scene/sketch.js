// Chrome Dino Game
// Karthik Narayan
// 7 February 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
// - Added music to the project
// - Made the window of the project resizable

////////////////////////////////////////
// Karthik Narayan
// 7 February 2025
// Chrome Dino Game
////////////////////////////////////////

// TODO LIST
// - Make a gameover screen with a massive sad face in red, with a black background, include a retry button, also make it kind of scary looking with a spooky sound, almost like a jumpscare

let dinoX;
let dinoY;
let velocityY;
let jumpHeight;
let cactusX;
let cactusY;
let cactusSpeed;
let buttonPressed = false;
let gameState = "mainMenu";
let groundHeight;

function preload() {
  dinoImg = loadImage("assets/Dino.png");
  cactusImg = loadImage("assets/Cactus_01.png");
  dinoMenuImg = loadImage("assets/DinoWhite.png");
  endImg = loadImage("assets/Sad.png");

  soundTrack = loadSound("assets/cartoonGroove-Menu.mp3");
  
  scoreFont = loadFont("assets/PressStart2P.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  music();

  dinoX = width/5;
  dinoY = 0;

  velocityY = 0;
  jumpHeight = 19;

  groundHeight = height/2;
  
  cactusX = width + 100;
  cactusY = height - groundHeight - 17;
  
  cactusSpeed = 10;
  cactusSpeedChange = 0.1;
}

function draw() {
  mainMenu();
  gameplay();
}

function mainMenu() {
  if (gameState === "mainMenu") {
    background("black");
    playButton();
    menuDinosaur();
    menuTitle();
  }
  return;
}

function gameplay() {
  if (gameState === "gameplay") {
    background("white");
    scoreText();
    createDino();
    moveDino();
    createCactus();
    moveCactus();
    collisonDetection();
    
    console.log(cactusSpeed);
  }
  return;
}

function createDino() {
  // Render the dinosaur sprite
  image(dinoImg, dinoX, dinoY, 75, 75);
  
  // Accessibility 
  describe('An image of a pixelated cartoon dinosaur');
}

function createCactus() {
  // Render the dinosaur sprite
  image(cactusImg, cactusX, cactusY, 46, 92);
  
  // Accessibility 
  describe('An image of a pixelated cartoon cactus');
}

function moveDino() {
  // Gravity - If not touching ground then move down, if on ground and key is pressed then move up
  if (dinoY < height - groundHeight) {
    velocityY += 1;
    dinoY += velocityY;
  } else if (dinoY >= height - groundHeight && keyIsPressed) {
    velocityY = -jumpHeight;
    dinoY += velocityY;
  }
}

function moveCactus() {
  // Move the Cactus
  cactusX -= cactusSpeed;
  
  // If cactus goes off screen then make a new cactus and speed it up
  if (cactusX < 0 - cactusImg.width) {
    cactusX = width + 100;
    cactusY = height - groundHeight - 17;
    if (cactusSpeed >= 14.9) {
    cactusSpeed = 14.9;
  }
    cactusSpeed += cactusSpeedChange;
    createCactus();
  }
}

function groundVisuals() {
  // Renders the visuals of the ground object
  
}

function gameOver() {
  // Renders the gameover screen with an image of a sad face
  background(0);
  image(endImg, 0, 0, width, height);
  noLoop();
  
}

function collisonDetection() {
  // Detects of the cactus has collided with the dinosaur
  if (cactusX <= dinoX + 70 && cactusX >= dinoX - 30 && dinoY + 70 >= cactusY) {
    gameOver();
  } 
}

function scoreText() {
  // Renders the score
  fill(82, 82, 82); // Fill with a grayish black color
  textFont(scoreFont);
  textSize(24);
  text(frameCount, width - width/5, width/10);
}

function music() {  
  // Play audio
  soundTrack.loop();
  soundTrack.setVolume(0.1);
}

function soundEffects() {
  // Load audio
}

function playButton() {
  // Renders the triangular play button on the menu, and controls mouse cursor logic

  // If mouse is over the button change the color
  noStroke();
  if (mouseX >= 75 && mouseX <= 155 && mouseY >= 200 && mouseY <= 300) {
    fill(181, 24, 13);
  } else {
    fill("red");
  }
  
  // If mouse is over the button and the mouse is clicked, then begin gameplay
  if (mouseX >= 75 && mouseX <= 155 && mouseY >= 200 && mouseY <= 300 && mouseIsPressed) {
    gameState = "gameplay";
  }
  
  // Scale the play button based on window size
  push();
  scale(width/1000);
  triangle(300, 200, 300, 300, 400, 250);
  pop();
}

function menuTitle() {
  // Creates the title on the menu screen
  textFont(scoreFont);
  fill("white");
  textSize(width/16.6666667);
  text("CHROME DINO",Math.tan(frameCount * 0.01) * 10 + width/2 - (width * 0.3375), Math.cos(frameCount * 0.01) * 10 + height/4);
}

function menuDinosaur() {
  // Renders the menu dinosaur image and flips it horizontally
  scale(-1, 1);
  image(dinoMenuImg, Math.cos(frameCount * 0.025) * 5 - width*1.2, Math.cos(frameCount * 0.05) * 2 + height/2, 0.6875 * width, 0.6875 * width);
  scale(-1, 1);
}

function windowResized() {
  // Resizes canvas
  resizeCanvas(windowWidth, windowHeight);

  // Refreshes variables so the cactuses don't bug out 
  groundHeight = height/2;
  cactusX = width + 100;
  cactusY = height - groundHeight - 17;
  dinoY = height - groundHeight;
}


