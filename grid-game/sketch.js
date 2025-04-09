// Grid game | Tower Defense
// Karthik Narayan
// March.26/2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
// - BFS Pathfinding

const CELL_SIZE = 100;
const PLAYER = "P";
const BALLOON_START = "S";
const BALLOON_END = "E";
const ROAD = "R";

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
let money = 0;

let font;

let playerPiece = {
  x: 0,
  y: 0,
  oldX: 0, 
  oldY: 0,
};

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
  // Change the tile to the player
  grid[playerPiece.y][playerPiece.x] = PLAYER;
  // console.log(playerPiece.x, playerPiece.y);

  // Set old piece location
  playerPiece.oldY = playerPiece.y;
  playerPiece.oldX = playerPiece.x;
}

function mouseClicked() {
  // Clear old piece
  grid[playerPiece.oldY][playerPiece.oldX] = 0;

  // Find the x and y positions relative to the grid
  playerPiece.y = Math.ceil(mouseY/CELL_SIZE) - 1;
  playerPiece.x = Math.ceil(mouseX/CELL_SIZE) - 1;
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
  if (millis() % 1000 < 20 && millis() % 1000 > 0) { // Counts up by $100 every 1000ms or 1 second -> The greater than and less than are there as security b/c if you lag the millis function skips past certain values
    money += 100;
  }

  // Text Styling
  fill(color(255, 255, 255));
  textAlign(RIGHT);
  textFont(font);
  textSize(30);

  text(`$${money}`, width - width/32, height/5);
}

function selectedCharacterText() {
  // Text Styling
  fill(color(255, 255, 255));
  textAlign(RIGHT);
  textFont(font);
  textSize(30);

  text("Character", width - width/32, height/8);
}