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
}

function draw() {
  background(220);
  displayGrid(cols, rows);
  displayPiece();
  BFSPathfinding(grid, balloonSpawnLocation, balloonEndLocation);
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

function BFSPathfinding(grid, start, end) { // Resource : https://www.reddit.com/r/leetcode/comments/125tvft/how_do_i_start_with_bfs_on_matrix/
  // Queue of the path taken
  visited = [];
  queue = [];
  // Push the first path to into the queue
  queue.push(start);

  let length;
  while (queue.length > 0) {
    for (let i = 0; i < queue.length; i++) {
      // Current node/grid item
      let node = queue.shift();
      if (node === end) {
        return length;
      }
      
      // For nodes/grid objects next to the current node/grid item push them to the queue / N, S, W, E 
      // Find neighbours of node
      let neighbourOne = { // Up
        x: node.x,
        y: node.y - 1,
      };
      let neighbourTwo = { // Down
        x: node.x,
        y: node.y + 1,
      };
      let neighbourThree = { // Left 
        x: node.x - 1,
        y: node.y,
      };
      let neighbourFour = { // Right
        x: node.x + 1,
        y: node.y,
      };
    }
    length += 1;
  }
}