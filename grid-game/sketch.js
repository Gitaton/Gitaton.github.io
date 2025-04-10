// Grid game | Tower Defense
// Karthik Narayan
// March.26/2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
// - BFS Pathfinding
// - Loading and using a new font
// - CSS Styling: box shadow, border 
// - Maps
// - Template literals
// - p5.sound | Music & Sound
//
// Instructions:
// - Scroll Wheel to choose a character
// - Click to place selected character
// - Enemies will go from the green square to the red square, enemy health is displayed in red above each enemy
// - Characters will only attack tiles adjacent to their own
// - Stop the enemies from making it to the end (the red tile)


const CELL_SIZE = 100;
const ENEMY = "P";
const BALLOON_START = "S";
const BALLOON_END = "E";
const ROAD = "R";
const MONEY_TIMER = 2000; // Time between each increase of money
const MONEY_AMOUNT_PER_CYCLE = 100;
const STARTING_HEALTH = 100;
const ENEMY_INTERVAL = 2000;

let grid;
let rows;
let cols;
let queue;
let visited;
let previous;
let path;
let neighbours;
let characters;
let currentCharacter;
let money = 0;
let health = STARTING_HEALTH;
let cannotAfford = false;
let charactersOnScreen = [];
let enemiesOnScreen = [];
let enemyTimer = 0;
let font;

// Character & Enemy Stats
let beastMan = {
  name: "beastMan",
  x: 0,
  y: 0,
  price: 1000,
  attackSpeed: 10,
  damage: 100,
  gridValue: "B",
  targetingRadius: 4, 
};

let tankMan = {
  name: "tankMan",
  x: 0,
  y: 0,
  price: 500,
  attackSpeed: 5,
  damage: 25, 
  gridValue: "T",
  targetingRadius: 3, 
};

let regularMan = {
  name: "regularMan",
  x: 0,
  y: 0,
  price: 100,
  attackSpeed: 10,
  damage: 10,
  gridValue: "M",
  targetingRadius: 2,
};

let regularEnemy = {
  x: 0,
  y: 0,
  damage: 15,
  health: 100,
  currentIndexOnPath: 0,
};

characters = [beastMan, tankMan, regularMan];
currentCharacter = characters[0];

// Instantiate a balloon spawn point
let balloonSpawnLocation = {
  x: 0,
  y: 0,
};

// Instantiate a balloon end point
let balloonEndLocation = {
  x: 0,
  y: 0,
};

function preload() {
  font = loadFont("VCR_OSD_MONO_1.001.ttf");
  clickSound = loadSound("click.mp3");
  gameplayMusic = loadSound("relaxing-loop-110470.mp3");
  gameOverMusic = loadSound("game-over-39-199830.mp3");
}

function setup() {
  createCanvas(windowWidth * 0.9, windowHeight * 0.9);

  cursor(CROSS); // Changes the appearance of the cursor

  gameplayMusic.loop(); // Loop the music

  stroke(40, 54, 24); // Changes the stroke color to a dark green
  strokeWeight(3); // Increases the stroke width

  cols = width/CELL_SIZE;
  rows = height/CELL_SIZE;

  // Set the balloon spawn location
  balloonSpawnLocation = {
    x: Math.floor(random(2, cols/2 - 2)),
    y: Math.floor(random(2, rows - 2)),
  };

  // Set the balloon end location
  balloonEndLocation = {
    x: Math.floor(random(cols/2 + 2, cols - 2)),
    y: Math.floor(random(2, rows - 2)),
  };

  grid = generateGridMap(cols, rows);

  // Place the balloon start and end on the grid
  balloonStartAndEnd();
  
  // BFS Pathfinding functions
  previous = BFSPathfinding(balloonSpawnLocation, balloonEndLocation);
  path = reconstructPath(balloonEndLocation, previous);
}

function draw() {
  background(220);
  displayGrid(cols, rows);
  displayPiece();
  countMoney();
  selectedCharacterText();
  countHealth();
  cannotAffordText();
  drawPath(grid, path);
  renderEnemy();
  gameOver();
}

function generateGridMap(cols, rows) { // Creates default values for grid
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(0);
    }
  }
  return newGrid;
}

function displayGrid(cols, rows) { // Draws the grid with elements
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 0) {
        fill(color(96, 108, 56)); // Fill with dark green
      }
      else if (grid[y][x] === ENEMY) {
        fill("white");
      }
      else if (grid[y][x] === BALLOON_START) {
        fill("green");
      }
      else if (grid[y][x] === BALLOON_END) {
        fill("red");
      }
      else if (grid[y][x] === ROAD) {
        fill(color(221, 161, 94)); // Fill with a biege like color
      }
      else if (grid[y][x] === beastMan.gridValue) {
        fill("yellow");
      }
      else if (grid[y][x] === tankMan.gridValue) {
        fill("CornflowerBlue");
      }
      else if (grid[y][x] === regularMan.gridValue) {
        fill("orange");
      }
      rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

function balloonStartAndEnd() {
  // Render Balloon Start and End
  grid[balloonSpawnLocation.y][balloonSpawnLocation.x] = BALLOON_START;
  grid[balloonEndLocation.y][balloonEndLocation.x] = BALLOON_END;
}

function displayPiece() {
  grid[currentCharacter.y][currentCharacter.x] = currentCharacter.gridValue; // Place character on grid

  // Clear (0, 0)
  grid[0][0] = 0;
}

function mouseClicked() {
  // Play sound effect
  clickSound.play();

  // If the player can afford the current character & is not placing over the path or start/end, then place it down
  if (money >= currentCharacter.price &&
     grid[Math.ceil(mouseY/CELL_SIZE) - 1][Math.ceil(mouseX/CELL_SIZE) - 1] !== ROAD &&
     grid[Math.ceil(mouseY/CELL_SIZE) - 1][Math.ceil(mouseX/CELL_SIZE) - 1] !== BALLOON_START &&
     grid[Math.ceil(mouseY/CELL_SIZE) - 1][Math.ceil(mouseX/CELL_SIZE) - 1] !== BALLOON_END
  ) { 
    // Subtract price from money
    money -= currentCharacter.price;
    cannotAfford = false;

    // Change location of the selected character to new location
    currentCharacter.y = Math.ceil(mouseY/CELL_SIZE) - 1;
    currentCharacter.x = Math.ceil(mouseX/CELL_SIZE) - 1;

    charactersOnScreen.push(structuredClone(currentCharacter));

    grid[currentCharacter.y][currentCharacter.x] = currentCharacter.gridValue; // Instatiate character on grid
  }
  else {
    cannotAfford = true;
  }
}

function characterDamage() {
  for (let i = 0; i < charactersOnScreen.length; i++) { // For every character on screen check it's neighbours
    let neighbourOne = { // Up
      x: charactersOnScreen[i].x,
      y: charactersOnScreen[i].y - 1,
    };
    let neighbourTwo = { // Down
      x: charactersOnScreen[i].x,
      y: charactersOnScreen[i].y + 1,
    };
    let neighbourThree = { // Right
      x: charactersOnScreen[i].x + 1,
      y: charactersOnScreen[i].y,
    };
    let neighbourFour = { // Left
      x: charactersOnScreen[i].x - 1,
      y: charactersOnScreen[i].y,
    };

    let neighbours = [neighbourOne, neighbourTwo, neighbourThree, neighbourFour];

    for (let neighbour of neighbours) {
      for (let j = 0; j < enemiesOnScreen.length; j++) {
        if (neighbour.x === enemiesOnScreen[j].x && neighbour.y === enemiesOnScreen[j].y) { // If a neighbouring location is the same as an enemy, attack it
          enemiesOnScreen[j].health -= charactersOnScreen[i].damage; // Attack
          if (enemiesOnScreen[j].health <= 0) {
            enemiesOnScreen.splice(j, 1); // An enemy has died
          }
        }
      }
    }
  }
}

function BFSPathfinding(start, end) { 
  visited = [];
  queue = [];
  previous = {}; // Map each node to its parent

  visited.push(start);
  queue.push(start);

  while (queue.length > 0) {
    let currentNode = queue.shift();

    if (currentNode.x === end.x && currentNode.y === end.y) {
      return previous;
    }

    let neighbourOne = { // Up
      x: currentNode.x,
      y: currentNode.y - 1,
    };
    let neighbourTwo = { // Down
      x: currentNode.x,
      y: currentNode.y + 1,
    };
    let neighbourThree = { // Left 
      x: currentNode.x - 1,
      y: currentNode.y,
    };
    let neighbourFour = { // Right
      x: currentNode.x + 1,
      y: currentNode.y,
    };

    neighbours = [neighbourOne, neighbourTwo, neighbourThree, neighbourFour];

    for (let neighbour of neighbours) { // For every neighbour of current node
      if (
        !visited.some(v => v.x === neighbour.x && v.y === neighbour.y) &&
        neighbour.x >= 0 && neighbour.x < cols &&
        neighbour.y >= 0 && neighbour.y < rows
      ) { // neighbour is not visited
        visited.push(neighbour);
        queue.push(neighbour);
        previous[`${neighbour.x},${neighbour.y}`] = currentNode; // Map neighbour to current node
      }
    }
  }

  return previous; // Return previous even if the end is not reached
}

function reconstructPath(end, previous) {
  path = [];

  // From the end node work backwards, finding the parent node of each neighbour until you make it to the start
  for (let i = end; i !== undefined; i = previous[`${i.x},${i.y}`]) {
    path.push(i);
  }

  path.reverse(); // Make the path go from start to finish instead of the opposite
  path.shift(); // Delete start node from path
  path.pop(); // Delete end node from path

  return path;
}

// Draws the path
function drawPath(grid, path) {
  for (let i = 0; i < path.length; i++) {
    grid[path[i].y][path[i].x] = ROAD;
  }
}

function countMoney() {
  if (millis() % MONEY_TIMER < 20 && millis() % MONEY_TIMER > 0) { // Counts up by $100 every 1000ms or 1 second -> The greater than and less than are there as security b/c if you lag the millis function skips past certain values
    money += MONEY_AMOUNT_PER_CYCLE;
  }

  // Text Styling
  fill(color(255, 255, 255));
  textAlign(RIGHT);
  textFont(font);
  textSize(30);

  text(`$${money}`, width - width/32, height/5); // Renders money text
}

function selectedCharacterText() { // Renders selected character text
  // Text Styling
  fill(color(255, 255, 255));
  textAlign(RIGHT);
  textFont(font);
  textSize(30);

  text(`${currentCharacter.name} - $${currentCharacter.price}`, width - width/32, height/8);
}

function countHealth() { 
  // Text Styling
  fill(color("red"));
  textAlign(LEFT);
  textFont(font);
  textSize(30);

  text(`Health: ${health}`, width/32, height/8); // Renders health text
}

function cannotAffordText() { // Indicates when you cannot afford a character
  if (cannotAfford === true) {
    // Text Styling
    fill(color("red"));
    textAlign(LEFT);
    textFont(font);
    textSize(20);

    text("Cannot Afford", mouseX + width/100, mouseY); 

    if (sin(0.01 * millis()) < 0) { // Lasts a little bit of time, a gamble however
      cannotAfford = false;
    }
  }
}

function renderEnemy() {
  if (millis() - enemyTimer > ENEMY_INTERVAL) { // Spawns and moves enemies per 
    characterDamage();
    spawnEnemy(); // Spawn enemy every interval
    enemyTimer = millis(); // Reset Timer
  }

  for (let i = 0; i < enemiesOnScreen.length; i++) { // Places enemy locations on grid
    enemiesOnScreen[i].y = path[enemiesOnScreen[i].currentIndexOnPath].y;
    enemiesOnScreen[i].x = path[enemiesOnScreen[i].currentIndexOnPath].x;

    text(enemiesOnScreen[i].health, enemiesOnScreen[i].x * CELL_SIZE, enemiesOnScreen[i].y * CELL_SIZE);
    grid[enemiesOnScreen[i].y][enemiesOnScreen[i].x] = ENEMY;
  }
}

function spawnEnemy() { // Code to spawn and move enemy
  enemiesOnScreen.push(structuredClone(regularEnemy));
  for (let i = enemiesOnScreen.length - 1; i > 1; i--) {
    if (enemiesOnScreen[i].currentIndexOnPath < path.length - 1) { // Occasionally will break - known bug - unknown fix
      enemiesOnScreen[i].currentIndexOnPath += 1;
    }
    else {
      enemiesOnScreen.pop(); // Delete last enemy
      health -= 10; // Subtract health
      enemiesOnScreen.pop(); // Deletes the actual last enemy - bug fixed
    }
  }
}

function gameOver() { // When the player loses
  if (health <= 0) {
    // Pause gameplay music
    gameplayMusic.pause();

    // Play game over music
    if (!gameOverMusic.isPlaying()) {
      gameOverMusic.play();
    }

    // Draw a new background
    fill("darkred");
    textSize(width/20);
    rect(0, 0, width, height);

    // Draw a stylistic circle
    stroke("black");
    fill("red");
    strokeWeight(30);
    circle(4/5 * width, height/2, height * 2);

    // Render game over text
    fill("black");
    strokeWeight(3);
    text("Game Over", width/2, height/1.9);

  }
}

function mouseWheel(event) {
  if (event.delta > 0) { // Mouse scrolled up - Scroll through characters 
    if (characters.indexOf(currentCharacter) !== 2) {
      currentCharacter = characters[characters.indexOf(currentCharacter) + 1];
    }
    else {
      currentCharacter = characters[0];
    }
  }
  else { // Mouse scrolled down - Scroll through characters 
    if (characters.indexOf(currentCharacter) !== 0) {
      currentCharacter = characters[characters.indexOf(currentCharacter) - 1];
    }
    else {
      currentCharacter = characters[characters.length - 1];
    }
  }
}