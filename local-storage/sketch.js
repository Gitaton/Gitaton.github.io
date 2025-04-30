// Local Storage Demo
// Karthik Narayan
// April 30 2025

let numberOfClicks = 0;
let hightestClickEver = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Is there an old highscore?
  if (getItem("highClick")) {
    hightestClickEver = getItem("highClick");
  }

}

function draw() {
  background(220);

  displayClicks();
  displayHighest();
}

function mousePressed() {
  numberOfClicks++;
  if (numberOfClicks > hightestClickEver) {
    hightestClickEver = numberOfClicks;
    storeItem("highClick", hightestClickEver);
  }
}

function displayClicks() {
  fill("black");
  textSize(50);
  textAlign(CENTER, CENTER);
  text(numberOfClicks, width/2, height/2);
}

function displayHighest() {
  fill("green");
  textSize(50);
  textAlign(CENTER, CENTER);
  text(hightestClickEver, width/2, height/2 - 200);
}
