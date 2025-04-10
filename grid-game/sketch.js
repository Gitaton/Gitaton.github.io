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

// COLOR PALETTE: https://coolors.co/palette/606c38-283618-fefae0-dda15e-bc6c25

// TODO:
// - Enemies
// - Bullets/Damage
// - Health

const CELL_SIZE = 100;
const PLAYER = "P";
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
let oldY;
let oldX;
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
let cycleTwice = false;

let font;

let playerPiece = {
  x: 0,
  y: 0,
  oldX: 0, 
  oldY: 0,
};

// Character Stats
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
  damage: 150, 
  gridValue: "T",
  targetingRadius: 3, 
};

let regularMan = {
  name: "regularMan",
  x: 0,
  y: 0,
  price: 100,
  attackSpeed: 10,
  damage: 30,
  gridValue: "M",
  targetingRadius: 2,
};

let regularEnemy = {
  oldX: 0,
  oldY: 0,
  x: 0,
  y: 0,
  damage: 15,
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
}

function setup() {
  createCanvas(windowWidth * 0.9, windowHeight * 0.9);

  cursor(CROSS); // Changes the appearance of the cursor

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
  drawPath(grid, path);
}

function draw() {
  background(220);
  displayGrid(cols, rows);
  displayPiece();
  countMoney();
  selectedCharacterText();
  countHealth();
  cannotAffordText();
  spawnEnemy();
  renderEnemies();
}

function generateGridMap(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(0);
    }
  }
  return newGrid;
}

function displayGrid(cols, rows) {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 0) {
        fill(color(96, 108, 56)); // Fill with dark green
      }
      else if (grid[y][x] === PLAYER) {
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
  grid[currentCharacter.y][currentCharacter.x] = currentCharacter.gridValue;

  // Clear (0, 0)
  grid[0][0] = 0;
}

function mouseClicked() {
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

    charactersOnScreen.push(currentCharacter);

    grid[currentCharacter.y][currentCharacter.x] = currentCharacter.gridValue; // Instatiate character on grid
  }
  else {
    cannotAfford = true;
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

function cannotAffordText() {
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

function spawnEnemy() {
  if (millis() - enemyTimer > ENEMY_INTERVAL) {
    enemiesOnScreen.push(structuredClone(regularEnemy)); // Add an enemy to the screen
    
    // Move enemy
    for (let enemy of enemiesOnScreen) {
      console.log(enemy);
      // Delete old enemy
      if (enemy.currentIndexOnPath !== 0) {
        enemy.oldY = path[enemy.currentIndexOnPath - 1].y;
        enemy.oldX = path[enemy.currentIndexOnPath - 1].x;
      }

      enemy.y = path[enemy.currentIndexOnPath].y;
      enemy.x = path[enemy.currentIndexOnPath].x;

      if (cycleTwice === true) {
        enemy.currentIndexOnPath += 1;
        cycleTwice = false;
      }
    }
    
    enemyTimer = millis(); // Reset Timer
    cycleTwice = true;
  }
}

function renderEnemies() {
  for (let enemy of enemiesOnScreen) {
    grid[enemy.oldY][enemy.oldX] = ROAD;
    grid[enemy.y][enemy.x] = PLAYER;
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