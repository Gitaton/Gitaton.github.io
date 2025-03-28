// BattleMans | A mix of BTD and Battle Cats/Dino Bash
// Karthik Narayan
// Mar.12, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
// - I used p5.party to create a multiplayer game (2 players max per lobby/room)
// - Trig functions as x or y values to create smooth animations
// - Music/Sound Effects
// - p5 pop() and push() along with the tint() function
//
// HOW TO PLAY - Your goal is to place your troops so they make it to the other side of the screen, but watch out, your opponent has troops of their own (Buttons at the bottom of the screen)
// SIDENOTE - If you lose, you will get disconnected from the server
// Credit to the creators of Altos Adventure for the background image

let gameState = "mainMenu";

// Lets the player choose a room
let room = prompt("Enter room name");

let me;
let guests;

let playButtonTextSize = 25;

// Global variables for the character spawn buttons
let buttonSpacing;
let buttonSize;
let buttonHeight;

// Character Stats
let tankman = {
  name: "tankman",
  health: 1000,
  value: 80,
  damage: 100,
  moveSpeed: 1,
  x: 50,
  y: 200,
  velocityY: 0,
  height: 100,
};

let speedman = {
  name: "speedman",
  health: 150,
  value: 30,
  damage: 75,
  moveSpeed: 3,
  x: 50,
  y: 200,
  velocityY: 0,
  height: 51,
};

let beastman = {
  name: "beastman",
  health: 5750,
  value: 500,
  damage: 1000,
  moveSpeed: 2,
  x: 50,
  y: 200,
  velocityY: 0,
  height: 290,
};

let characterChoices = [tankman, speedman, beastman];

function preload() {
  // Connect to the server
  partyConnect("wss://demoserver.p5party.org", "battleMans", room);

  // Loads players shared
  me = partyLoadMyShared({
    x: 50,
    y: 50,
    money: 0,
    charactersOnScreen: [],
    globalHealth: 100,
  });

  // Loads guests shared
  guests = partyLoadGuestShareds();

  // Load audio
  deathSound = loadSound("assets/Death.mp3");
  music = loadSound("assets/Cozy_Forest.mp3");

  // Load images
  menuBackgroundImage = loadImage("assets/Background.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Show p5.party panel
  partyToggleInfo(false);

  // Intialize spawn button variables
  buttonSpacing = width/8;
  buttonSize = height/6;
  buttonHeight = height - height/4;

  // Visual Styling
  strokeWeight(4);
  stroke(color("white"));
}

function draw() {
  // Renders the main menu
  mainMenu();

  // Renders the gameplay
  gameplay();
}

function gameplay() {
  // Renders gameplay elements
  if (gameState === "gameplay") {
    background(27, 38, 59);
    renderGuestText(); 
    renderGround();
    gameplayUI();
    moneyUI();
    spawnCharacter();
    renderGuestCharacters();
    takeGlobalDamage();
    characterDeath();
  }
}

function mainMenu() {
  // Renders the elements of the main menu
  if (gameState === "mainMenu") {
    // Background color just incase
    background(27, 38, 59);

    // Render background image
    push();
    tint("red");
    image(menuBackgroundImage, 0, 0, width, height);
    pop();

    titleText();
    playButton();
  }
}

function titleText() {
  // Text styling
  textSize(100);
  fill("red");
  textFont("Comic Sans MS");
  textAlign(CENTER);

  // Render text
  text("BattleMans", Math.tan(frameCount * 0.01)*10 + width/2, height/4);
}

function playButton() {
  // Text styling
  fill("blue");
  textFont("Comic Sans MS");
  textAlign(CENTER);
  let textChanger;

  // If Mouse Hovering then increase the text size smoothly
  if (mouseX < width/2 + 75 && mouseX > width/2 - 75 && mouseY < height/2 + 15 && mouseY > height/2 - 50) {
    playButtonTextSize = playButtonTextSize + (30 - playButtonTextSize/4);
    textSize(playButtonTextSize);
    textChanger = "(ง'̀-'́)ง play (ง'̀-'́)ง";

    // If Mouse Hovering And Mouse Left Clicked then change gameState to gameplay
    if (mouseIsPressed && mouseButton === LEFT) {
      gameState = "gameplay";
    }
  } 
  else {
    // Don't change the text size 
    playButtonTextSize = 80;
    textSize(playButtonTextSize);
    textChanger = "play";
  }

  // Render Text
  text(textChanger, width/2, height/2);
}

function renderGuestText() {
  for (let guest of guests) {
    if (guest !== me) {
      // Round guest money
      let roundedMoney;
      roundedMoney = Math.round(guest.money);

      // For every guest, render the money and health text
      fill("blue");
      text("$ " + roundedMoney, width - width/16, height/16);
      text("♡ " + guest.globalHealth + "%", width - width/16, height/7);
    }
  }
}

function renderGround() {
  // Draws the ground
  fill(13, 27, 42);
  rect(0, height*2/3, width, height/3);
}

function spawnCharacter() {
  // Move Character
  for (let i = me.charactersOnScreen.length-1; i >= 0; i--) {
    // Move character forward
    me.charactersOnScreen[i].x += me.charactersOnScreen[i].moveSpeed;

    // If character above the ground, add gravity
    if (me.charactersOnScreen[i].y + me.charactersOnScreen[i].height < height*2/3) {
      me.charactersOnScreen[i].velocityY += 1;
      me.charactersOnScreen[i].y += me.charactersOnScreen[i].velocityY;
    } 
    else {
      me.charactersOnScreen[i].velocityY = 0;
    }

    // Render characters
    fill("red");
    if (me.charactersOnScreen[i].name === "tankman") {
      rect(me.charactersOnScreen[i].x, me.charactersOnScreen[i].y, 100, 100);
    }
    else if (me.charactersOnScreen[i].name === "speedman") {
      circle(me.charactersOnScreen[i].x, me.charactersOnScreen[i].y, 100);
    }
    else if (me.charactersOnScreen[i].name === "beastman") {
      rect(me.charactersOnScreen[i].x, me.charactersOnScreen[i].y, 100, 300);
    }
  }
}

function characterDeath() {
  // For every one of my characters
  for (let i = me.charactersOnScreen.length-1; i >= 0; i--) {
    // Look through all of the guest characters
    for (let guest of guests) {
      if (guest !== me) {
        for (let e = guest.charactersOnScreen.length-1; e>=0; e--) {
          // If both the player character and guest character are close to eachother then attack!
          if (me.charactersOnScreen[i].x - (width - guest.charactersOnScreen[e].x) < 50 && me.charactersOnScreen[i].x - (width - guest.charactersOnScreen[e].x) > 0) {
            me.charactersOnScreen[i].health -= guest.charactersOnScreen[e].damage;
            
            // If character has no health left, then remove it and play a sound
            if (me.charactersOnScreen[i].health <= 0) {
              deathSound.play();
              me.charactersOnScreen.splice(i, 1);
            }
          }
        }
      }
    }
  }
}

function renderGuestCharacters() {
  // For every guest not including yourself
  for (let guest of guests) {
    if (guest !== me) {
      // Render the guest's characters on the opposite side of the screen
      for (let i = guest.charactersOnScreen.length-1; i>=0; i--) {
        fill("blue");
        if (guest.charactersOnScreen[i].name === "tankman") {
          rect(width - guest.charactersOnScreen[i].x, guest.charactersOnScreen[i].y, 100, 100);
        }
        else if (guest.charactersOnScreen[i].name === "speedman") {
          circle(width - guest.charactersOnScreen[i].x, guest.charactersOnScreen[i].y, 100);
        }
        else if (guest.charactersOnScreen[i].name === "beastman") {
          rect(width - guest.charactersOnScreen[i].x, guest.charactersOnScreen[i].y, 100, 300);
        }
      }
    }
  }
}

function takeGlobalDamage() {
  // For every guest
  for (let guest of guests) {
    // If the guest is not the player
    if (guest !== me) {
      for (let i = guest.charactersOnScreen.length-1; i>=0; i--) {
        // Goes through all the characters and checks if they have gone past the screen
        if (width - guest.charactersOnScreen[i].x <= -100) {
          // If so, drain the players health and disconnect them
          if (me.globalHealth > 0) {
            me.globalHealth -= 1;
          }
          else {
            me.globalHealth = 0;
            partyDisconnect();
            partyToggleInfo(true);
          }
          // let index = guest.charactersOnScreen.indexOf(guest.charactersOnScreen[i]);
          // guest.charactersOnScreen.splice(index, 1);
        }
      }
    }
  }
}

function gameplayUI() {
  // Render the player's gameplay UI elements
  characterSpawnButtons();
}

function moneyUI() {
  // Initialize local variable
  let roundedMoney;

  // Text styling
  fill("red");
  textSize(50);

  // Add an amount to money every frame, then round it
  me.money = me.money + 0.1;
  roundedMoney = Math.round(me.money);

  // If money is ever below 0, bring it back up to 0
  if (me.money < 0) {
    me.money = 0;
  }

  // Render Money Text
  text("$ "+ roundedMoney, width/16, height/16);

  // Render Global Health Text
  text("♡ " + me.globalHealth + "%", width/16, height/7);
}

function characterSpawnButtons() {
  // Render the 3 character spawn buttons based on the number of character choices
  for (let i = 0; i < characterChoices.length; i++) {
    // Creates each rectangular button
    fill("red");
    rect(width/16 + i * buttonSpacing, buttonHeight, buttonSize, buttonSize);

    // Draws the text inside the button
    textSize(20);
    fill(0);
    text(characterChoices[i].name + " - " + characterChoices[i].value, width/16 + i * buttonSpacing + buttonSize/2, buttonHeight + buttonSize/2);
  }
}

function spawnCharacterButtonPress() {
  // For every character spawn button
  for (let i = characterChoices.length; i >= 0; i--) {
    // Check distance from mouse to buttons
    if (dist(mouseX, mouseY, width/16 + i * buttonSpacing + buttonSize/2, buttonHeight + buttonSize/2) <= buttonSize/2) {
      // Spawn specific character if player can afford
      if (me.money >= characterChoices[i].value) {
        // Reduce money amount & Add the selected character to the screen
        me.charactersOnScreen.push(structuredClone(characterChoices[i]));
        me.money -= characterChoices[i].value;
      }
    }
  }
}

function mouseClicked() {
  // Play background music
  let musicPlaying = false;
  if (musicPlaying === false) {
    music.setVolume(0.05);
    music.play();
    musicPlaying = true;
  }

  // If in gameplay and the mouse is clicked on the button, spawn a character
  if (gameState === "gameplay") {
    spawnCharacterButtonPress();
  }
}

function windowResized() {
  // Changes the canvas size if the window is resized
  resizeCanvas(windowWidth, windowHeight);
}