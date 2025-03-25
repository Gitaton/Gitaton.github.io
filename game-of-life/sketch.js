// Game of Life Demo
// Karthik Narayan
// Pick a cell size, then fill the screen with as many as possible.
// This will likely be rectangular instead of square...

const CELL_SIZE = 25;
const RENDER_ON_FRAME = 1;
let grid;
let rows;
let cols;
let autoPlayIsOn = false;
let gosper;

function preload() {
  gosper = loadJSON("gosper-gun.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = Math.ceil(width/CELL_SIZE);
  rows = Math.ceil(height/CELL_SIZE);
  grid = generateRandomGrid(cols, rows);
}

function draw() {
  background(220);
  if (autoPlayIsOn && frameCount % RENDER_ON_FRAME === 0) {
    grid = updateGrid();
  }
  displayGrid();
}

function updateGrid() {
  // Make a new array to hold the new turn values
  let nextTurn = generateEmptyGrid(cols, rows);

  // Look at every cell
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let neighbors = 0;
      // Look at every neighbor
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          // Don't fall off the edge of the grid
          if (x+j >= 0 && x+j < cols && y+i >= 0 && y+i < rows) {
            neighbors += grid[y+i][x+j];
          }
        }
      }
      // Don't count self as neighbor
      neighbors -= grid[y][x];

      // Apply the rules
      if (grid[y][x] === 1) { // Currently alive
        if (neighbors === 2 || neighbors === 3) {
          nextTurn[y][x] = 1;
        }
        else {
          nextTurn[y][x] = 0;
        }
      }

      if (grid[y][x] === 0) { // Currently dead
        if (neighbors === 3) {
          nextTurn[y][x] = 1;
        }
        else {
          nextTurn[y][x] = 0;
        }
      }
    }
  }
  return nextTurn;
}

function keyPressed() {
  if (key === "e") {
    grid = generateEmptyGrid(cols, rows);
  }
  else if (key === "r") {
    grid = generateRandomGrid(cols, rows);
  }
  else if (key === "a") {
    autoPlayIsOn = !autoPlayIsOn;
  }
  else if (key === " ") {
    grid = updateGrid();
  }
  else if (key === "g") {
    grid = gosper;
  }
}

function mousePressed() {
  let x = Math.floor(mouseX/CELL_SIZE);
  let y = Math.floor(mouseY/CELL_SIZE);
  
  toggleCell(x, y);
}

function toggleCell(x, y) {
  if (grid[y][x] === 1) {
    grid[y][x] = 0;
  }
  else if (grid[y][x] === 0) {
    grid[y][x] = 1;
  }
}

function displayGrid() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 0) {
        fill("white");
      }
      else if (grid[y][x] === 1) {
        fill("black");
      }
      square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
    }
  }
}

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      //toss a 0 or 1 in randomly
      if (random(100) < 50) {
        newGrid[y].push(0);
      }
      else {
        newGrid[y].push(1);
      }
    }
  }
  return newGrid;
}

function generateEmptyGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(0);
    }
  }
  return newGrid;
}