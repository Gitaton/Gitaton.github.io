// Wave defense 2D but multiplayer like clash royale or something | Dino Bash 
// Karthik Narayan
// Mar.12, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// TODO 
// - Add p5.party

function preload() {
  // Connect to the server
  //partyConnect("wss://demoserver.p5party.org", "battleMans");

  // Loads shared objects
  // shared = partyLoadShared("shared", {
  //   x: 50,
  //   y: 50,
  // });
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Show p5.party panel
  //partyToggleInfo(true);
}

function mousePressed() {
  // shared.x = mouseX;
  // shared.y = mouseY;
}

function draw() {
  background(220);

  fill("black");
  
  rect(100, 100, 50, 50);
}
