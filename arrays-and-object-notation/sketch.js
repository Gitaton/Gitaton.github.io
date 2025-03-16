// Wave defense 2D but multiplayer like clash royale or something | Dino Bash 
// Karthik Narayan
// Mar.12, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// TODO 
// - Add p5.party

let gameState = "mainMenu";

let me;
let guests;

let playButtonTextSize = 25;

function preload() {
  // Connect to the server
  partyConnect("wss://demoserver.p5party.org", "battleMans");

  // Loads players shared
  me = partyLoadMyShared({
    x: 50,
    y: 50,
  });

  // Loads guests shared
  guests = partyLoadGuestShareds();

  // Load Images
  menuBackgroundImage = image();
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Show p5.party panel
  partyToggleInfo(true);
}

function draw() {
  mainMenu();
  console.log(mouseX);

  if (gameState === "gameplay") {
    background(220);
    renderGuests();
    renderPlayer();
  }
}

function mainMenu() {
  if (gameState === "mainMenu") {
    background(50);
    playButton();
  }
}

function playButton() {
  // Text styling
  textFont("Comic Sans MS");
  textAlign(CENTER);

  // If Mouse Hovering - NOT WORKING YET
  if (mouseX < width/2 + 75 && mouseX > width/2 - 75 && mouseY < height/2 + 15 && mouseY > height/2 - 50) {
    fill("white");
    playButtonTextSize = playButtonTextSize + (60 - playButtonTextSize/2);
    textSize(playButtonTextSize);
    if (mouseIsPressed) {
      gameState = "gameplay";
    }
  } 
  else {
    fill("black");
    playButtonTextSize = 80;
    textSize(playButtonTextSize);
  }

  // Render Text
  text("play", width/2, height/2);
}

function renderGuests() {
  for (let guest of guests) {
    // For every guest, draw this
    fill("black");
    rect(guest.x, guest.y, 50, 50);
  }
}

function renderPlayer() {
  // Draw the player
  fill("blue");
  rect(me.x, me.y, 50, 50);

  // Move the player
  if (keyIsDown(68)) {
    me.x += 1;
  }
  if (keyIsDown(65)) {
    me.x-= 1;
  }
}
