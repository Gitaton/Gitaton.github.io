// Grid game | Tower Defense
// Karthik Narayan
// March.26/2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
// TODO:
// - PATHFINDING - TRY BFS PATHFINDING FIRST

const CELL_SIZE = 100;
const PLAYER = "P";
const BALLOON_START = "S";
const BALLOON_END = "E";
let grid;
let rows;
let cols;
let oldY;
let oldX;
let queue;
let visited;

let playerPiece = {
  x: 0,
  y: 0,
  oldX: 0, 
  oldY: 0,
};

// Create a balloon spawn point
let balloonSpawnLocation = {
  x: 0,
  y: 0,
};

// Create a balloon end point
let balloonEndLocation = {
  x: 0,
  y: 0,
};

function setup() {
  createCanvas(windowWidth, windowHeight);

  cols = width/CELL_SIZE;
  rows = height/CELL_SIZE;

  balloonSpawnLocation = {
    x: Math.floor(random(cols/2)),
    y: Math.floor(random(rows)),
  };

  balloonEndLocation = {
    x: Math.floor(random(cols/2, cols)),
    y: Math.floor(random(rows)),
  };

  grid = generateGridMap(cols, rows);
  balloonStartAndEnd();
  
  visited = console.log(BFSPathfinding(grid, balloonSpawnLocation, balloonEndLocation));
  console.log(visited);
}

function draw() {
  background(220);
  displayGrid(cols, rows);
  displayPiece();

  // Display visited in grid
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
        fill("orangered");
      }
      else if (grid[y][x] === PLAYER) {
        fill("white");
      }
      else if (grid[y][x] === BALLOON_START) {
        fill("green");
      }
      else if (grid[y][x] === BALLOON_END) {
        fill("black");
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

// Currently breaks because the while loop goes on forever >>> The neighbours x and y values turn negative
function BFSPathfinding(grid, start, end) { // Resource : https://www.youtube.com/watch?v=cS-198wtfj0
  visited = [];
  queue = [];

  console.log(visited);

  visited.push(start);
  queue.push(start);

  while (queue.length > 0) {
    let currentNode = queue.shift();

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

    let neighbours = [neighbourOne, neighbourTwo, neighbourThree, neighbourFour];

    for (let neighbour of neighbours) { // For every neighbour of current node
      if (!visited.includes(neighbour)) { // neighbour is not visited
        visited.push(neighbour);
        queue.push(neighbour);
      }
    }
    return visited;
  }
}