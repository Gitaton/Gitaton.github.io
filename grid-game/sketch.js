// Grid game | Tower Defense
// Karthik Narayan
// March.26/2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const CELL_SIZE = 25;
let grid;


function setup() {
  createCanvas(windowWidth, windowHeight);

  grid = generateGridMap(width/CELL_SIZE, height/CELL_SIZE);
}

function draw() {
  background(220);
}

function generateGridMap(cols, rows) {
  let newGrid = [];
  for (let x = 0; x < rows; x++) {
    newGrid.push([]);
    for (let y = 0; y < cols; y++) {
      newGrid.push(1);
    }
  }
  return newGrid;
}