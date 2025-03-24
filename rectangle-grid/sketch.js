// Rectangle 2D Array Grid
// Karthik Narayan
// March.24/2025


let grid = [];
const CELL_SIZE = 50;

let cols;
let rows;

function setup() {
  createCanvas(windowWidth, windowHeight);
  cols = Math.ceil(height/CELL_SIZE);
  rows = Math.ceil(width/CELL_SIZE);

  gridValues(cols, rows);
}

function draw() {
  background(220);
  drawGrid();
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
      if (grid[y][x] === 1) {
        fill("black");
      }
      if (grid[y][x] === 0) {
        fill("white");
      }
      rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}
