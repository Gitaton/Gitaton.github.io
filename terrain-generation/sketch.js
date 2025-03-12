// Terrain Generation 2D Demo
// Karthik Narayan
// Mar.12, 2025

let terrain = [];
const NUMBER_OF_RECTS = 200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  generateTerrain(width/NUMBER_OF_RECTS);
}

function draw() {
  background(135, 206, 250);
  stroke(0,154,23);
  fill(0,154,23);

  for (let someRect of terrain) {
    rect(someRect.x, someRect.y, someRect.w, someRect.h);
  }
}

function generateTerrain(widthOfRect) {
  let time = 0;
  let deltaTime = 0.01;
  for (let i = 0; i < NUMBER_OF_RECTS; i++) {
    let theHeight = noise(time) * height;
    terrain.push(spawnRectangle(i * widthOfRect, theHeight, widthOfRect));
    time += deltaTime;
  }
}

function spawnRectangle(leftSide, rectHeight, rectWidth) {
  let theRect = {
    x: leftSide,
    y: height - rectHeight,
    w: rectWidth,
    h: rectHeight,
  };

  return theRect;
}
