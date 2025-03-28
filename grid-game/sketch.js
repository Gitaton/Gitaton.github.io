// Grid game | Tower Defense
// Karthik Narayan
// March.26/2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const CELL_SIZE = 100;
const PLAYER = 2;
let grid;
let rows;
let cols;
let oldY;
let oldX;

function setup() {
  createCanvas(windowWidth, windowHeight);

  cols = width/CELL_SIZE;
  rows = height/CELL_SIZE;

  grid = generateGridMap(cols, rows);
}

function draw() {
  background(220);
  displayGrid(cols, rows);
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
      if (grid[y][x] === 1) {
        fill("blue");
      }
      else if (grid[y][x] === 0) {
        fill("red");
      }
      else if (grid[y][x] === PLAYER) {
        fill("white");
      }
      rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

function mouseClicked() {
  // Find the x and y positions relative to the grid
  let y = Math.ceil(mouseY/CELL_SIZE) - 1;
  let x = Math.ceil(mouseX/CELL_SIZE) - 1;

  // Change the tile to the player
  grid[y][x] = PLAYER;
  console.log(x, y);
}