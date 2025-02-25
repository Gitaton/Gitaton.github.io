// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let waitTime = 2000;
let lastSwitchedTime = 0;
let isWhite = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  swapStateIfNeeded();
  showBackground();
}

function swapStateIfNeeded() {
  if (millis() > lastSwitchedTime + waitTime) {
    isWhite = !isWhite;
    lastSwitchedTime = millis();
  }
}

function showBackground() {
  if (isWhite) {
    background("white");
  } else {
    background("black");
  }
}