// Perlin Noise Demo || Moving a Circle
// Karthik Narayan
// Mar.11, 2025

let time = 0;
let deltaTime = 0.02;
let x;
let y;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  fill("black");
  x = noise(time) * width;
  y = noise(time, time, time) * height;
  circle(x, y, 50);

  time += deltaTime;
}
