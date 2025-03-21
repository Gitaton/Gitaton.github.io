// Wave defense 2D but multiplayer like clash royale or something | Dino Bash 
// Karthik Narayan
// Mar.12, 2025
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// TODO 
// - GAMEPLAY
// - VISUALS : ART-STYLE : FLAT ART ... ex. Altos Adventure ... https://retrostylegames.com/blog/best-2d-art-styles-for-games/#:~:text=and%20animated%20feel.-,Flat%20Art,dimensional%20or%20'flat'%20appearance.
// - AUDIO
// - CHARACTER DAMAGE

let gameState = "mainMenu";

// Lets the player choose a room
let room = prompt("Enter room name");

let me;
let guests;

let playButtonTextSize = 25;

let buttonSpacing;
let buttonSize;
let buttonHeight;

// Character Stats
let tankman = {
  name: "tankman",
  health: 1000,
  value: 100,
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
  value: 15,
  damage: 75,
  moveSpeed: 3,
  x: 50,
  y: 200,
  velocityY: 0,
  height: 51,
};

let beastman = {
  name: "beastman",
  health: 750,
  value: 1000,
  damage: 1000,
  moveSpeed: 2,
  x: 50,
  y: 200,
  velocityY: 0,
  height: 290,
};

let characterChoices = [tankman, speedman, beastman];
//let charactersOnScreen = [];

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

  // Load Images
  //menuBackgroundImage = image();
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Show p5.party panel
  partyToggleInfo(true);

  // Intialize button variables
  buttonSpacing = width/8;
  buttonSize = height/6;
  buttonHeight = height - height/4;
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
    background("#87CEEB");
    renderGuests(); 
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
    background(50);
    titleText();
    playButton();
  }
}

function titleText() {
  // Text styling
  textSize(100);
  fill("white");
  textFont("Comic Sans MS");
  textAlign(CENTER);

  // Render text
  text("BattleMans", Math.tan(frameCount * 0.01)*10 + width/2, height/4);
}

function playButton() {
  // Text styling
  fill("white");
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

function renderGuests() {
  for (let guest of guests) {
    if (guest !== me) {
      // For every guest, render the money and health text
      fill("red");
      text("$ " + guest.money, width - width/16, height/16);
      text("♡ " + guest.globalHealth + "%", width - width/16, height/7);
    }
  }
}

function renderGround() {
  // Draws the ground
  fill("#3f9b0b");
  rect(0, height*2/3, width, height/3);
}

function spawnCharacter() {
  // Move Character
  for (let i = me.charactersOnScreen.length-1; i >= 0; i--) {
    // Move character forward
    me.charactersOnScreen[i].x += me.charactersOnScreen[i].moveSpeed;

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
            
            // If character has no health left, then remove it
            if (me.charactersOnScreen[i].health <= 0) {
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
          }
          // let index = guest.charactersOnScreen.indexOf(guest.charactersOnScreen[i]);
          // guest.charactersOnScreen.splice(index, 1);
        }
      }
    }
  }
}

function gameplayUI() {
  characterSpawnButtons();
  //spawnCharacterButtonPress();
}

function moneyUI() {
  let roundedMoney;
  // Text styling
  textSize(50);

  me.money = me.money + 10;
  roundedMoney = Math.round(me.money);

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
    fill(255);
    rect(width/16 + i * buttonSpacing, buttonHeight, buttonSize, buttonSize);

    textSize(10);
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
  // If in gameplay and the mouse is clicked on the button, spawn a character
  if (gameState === "gameplay") {
    spawnCharacterButtonPress();
  }
}