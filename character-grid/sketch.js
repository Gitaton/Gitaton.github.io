// Rectangle 2D Array Grid
// Karthik Narayan
// March.24/2025


let grid = [];
let cols;
let rows;
const CELL_SIZE = 50;
const OPEN_TILE = 0;
const IMPASSIBLE = 1;
const PLAYER = 9;
let thePlayer = {
  x: 0,
  y: 0,
};

function preload() {
  grassImg = loadImage("grass2.png");
  pathIMG = loadImage("paving.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = Math.ceil(height/CELL_SIZE);
  rows = Math.ceil(width/CELL_SIZE);

  gridValues(cols, rows);

  // Add the player to the grid
  grid[thePlayer.y][thePlayer.x] = PLAYER;
}

function draw() {
  background(220);
  drawGrid();
}

function keyPressed() {
  if (key === "w") {
    // Move up
    movePlayer(thePlayer.x, thePlayer.y - 1);
  }
  if (key === "s") {
    // Move up
    movePlayer(thePlayer.x, thePlayer.y + 1);
  }
  if (key === "a") {
    // Move up
    movePlayer(thePlayer.x - 1, thePlayer.y);
  }
  if (key === "d") {
    // Move up
    movePlayer(thePlayer.x + 1, thePlayer.y);
  }
}

function movePlayer(x, y) {
  if (x >= 0 && x < cols && y >= 0 && y <= rows && grid[y][x] === OPEN_TILE) {
    // Previous player location
    let oldX = thePlayer.x;
    let oldY = thePlayer.y;
  
    // Keep track of where the player is now
    thePlayer.x = x;
    thePlayer.y = y;
  
    // Reset the old spot to be open
    grid[oldY][oldX] = OPEN_TILE;
  
    // Put player on grid
    grid[thePlayer.y][thePlayer.x] = PLAYER;
  }
}

function mousePressed() {
  let x = Math.floor(mouseX/CELL_SIZE);
  let y = Math.floor(mouseY/CELL_SIZE);
  
  // Toggle self
  toggleCell(x, y);

  // Toggle neighbors
  // toggleCell(x + 1, y); // Right
  // toggleCell(x - 1, y); // Left
  // toggleCell(x, y - 1); // Up
  // toggleCell(x, y + 1); // Down
}

function toggleCell(x, y) {
// Make sure cell you're toggling is actually in the grid
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    if (grid[y][x] === IMPASSIBLE) {
      grid[y][x] = OPEN_TILE;
    }
    else if (grid[y][x] === OPEN_TILE) {
      grid[y][x] = IMPASSIBLE;
    }
  }
}

function gridValues(cols, rows) {
  for (let y = 0; y < cols; y++) {
    grid.push([]);
    for (let x = 0; x < rows; x++) {
      // 1 or 0
      grid[y].push(round(random(0, 1)));
    }
  }
}

function drawGrid() {
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      if (grid[y][x] === IMPASSIBLE) {
        //fill("black");
        image(grassImg, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      if (grid[y][x] === OPEN_TILE) {
        //fill("white");
        image(pathIMG, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === PLAYER) {
        fill("red");
        rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}
