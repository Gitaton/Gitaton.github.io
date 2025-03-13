// Wave defense 2D but multiplayer like clash royale or something | Dino Bash 
// Karthik Narayan
// Mar.12, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// TODO 
// - Add p5.party

let shared;

function preload() {
  // Connect to the server
  partyConnect("wss://demoserver.p5party.org", "battleMans");

  // Loads shared objects
  guests = partyLoadGuestShareds();

  me = partyLoadMyShared({
    x: 50,
    y: 50,
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Show p5.party panel
  partyToggleInfo(true);
}

function draw() {
  background(220);
  player();
  console.log(me.x);
}

function player() {
  fill("black");
  rect(me.x, me.y, 50, 50);
  if (keyIsDown(68)) {
    me.x += 1;
  }
  if (keyIsDown(65)) {
    me.x-= 1;
  }
}
