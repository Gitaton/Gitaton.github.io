// Traffic Light Starter Code
// Karthik Narayan
// February 27, 2025

// GOAL: make a 'traffic light' simulator. For now, just have the light
// changing according to time. You may want to investigate the millis()
// function at https://p5js.org/reference/#/p5/millis

let trafficLightState = "green";
//let waitTime = 1000;
const GREEN_LIGHT_DURATION = 3000;
const YELLOW_LIGHT_DURATION = 1000;
const RED_LIGHT_DURATION = 4000;
let lastSwitchedTime = 0;
let colorTop;
let colorMiddle;
let colorBottom;

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(255);
  drawOutlineOfLights();
}

function drawOutlineOfLights() {
  //box
  rectMode(CENTER);
  fill(0);
  rect(width/2, height/2, 75, 200, 10);

  swapState();
  changeColors();
}

function swapState() {
  if (trafficLightState === "green" && millis() > lastSwitchedTime + GREEN_LIGHT_DURATION) {
    trafficLightState = "yellow";
    lastSwitchedTime = millis();
  }
  if (trafficLightState === "yellow" && millis() > lastSwitchedTime + YELLOW_LIGHT_DURATION) {
    trafficLightState = "red";
    lastSwitchedTime = millis();
  }
  if (trafficLightState === "red" && millis() > lastSwitchedTime + RED_LIGHT_DURATION) {
    trafficLightState = "green";
    lastSwitchedTime = millis();
  }
}

function changeColors() {
  if (trafficLightState === "green") {
    colorTop = "black";
    colorMiddle = "black";
    colorBottom = "green";
  }
  if (trafficLightState === "yellow") {
    colorTop = "black";
    colorMiddle = "yellow";
    colorBottom = "black";
  }
  if (trafficLightState === "red") {
    colorTop = "red";
    colorMiddle = "black";
    colorBottom = "black";
  }

  //lights
  fill(colorTop);
  ellipse(width/2, height/2 - 65, 50, 50); //top
  fill(colorMiddle);
  ellipse(width/2, height/2, 50, 50); //middle
  fill(colorBottom);
  ellipse(width/2, height/2 + 65, 50, 50); //bottom
}