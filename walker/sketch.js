// Walker OOP Demo
// Karthik Narayan
// April 11 2025

class Walker {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = 10;
    this.radius = 5;
  }

  display() {
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.radius * 2);
  }

  move() {
    let choice = random(100);
    if (choice < 25) {
      this.y -= this.speed; // Up
    }
    else if (choice < 50) {
      this.y += this.speed; // Down
    }
    else if (choice < 75) {
      this.x -= this.speed; // Left
    }
    else {
      this.x += this.speed; // Right
    }
  }
}

// let luke;
// let karthik;
let theWalkers = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // luke = new Walker(width/2, height/2, "red");
  // karthik = new Walker(width/3, height/3, "blue");
  spawnWalker(width/2, height/2);
}

function draw() {
  // luke.display();
  // karthik.display();

  // luke.move();
  // karthik.move();
  for (let myWalker of theWalkers) {
    myWalker.move();
    myWalker.display();
  }
}

function mousePressed() {
  spawnWalker(mouseX, mouseY);
}

function spawnWalker(x, y) {
  let r = random(255);
  let g = random(255);
  let b = random(255);
  let someColor = color(r, g, b);
  let someWalker = new Walker(x, y, someColor);
  theWalkers.push(someWalker);
}
