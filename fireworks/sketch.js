// Fireworks OOP
// Karthik Narayan
// April 14 2025
//

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = random(-2, 2);
    this.dy = random(-2, 2);
    this.radius = 2;
    this.r = 255;
    this.g = 0;
    this.b = 0;
    this.gravity = 0;
    this.opacity = 255;
  }

  display() {
    noStroke();

    this.b += 3.5;
    this.g += 2;
    fill(this.r, this.g, this.b, this.opacity);
    circle(this.x, this.y, this.radius * 2);
  }
  
  update() {
    // Move 
    this.x += this.dx;
    this.y += this.dy;
    this.gravity += 0.154 * 0.1;
    this.y += this.gravity;

    // Fade away over time
    this.opacity -= 0.5;
  }

  isDead() {
    return this.opacity <= 0;
  }
}

const NUMBER_OF_FIREWORKS_PER_CLICK = 150;

let theFireworks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background("black");

  for (let firework of theFireworks) {
    if (firework.isDead()) {
      // Delete it
      let index = theFireworks.indexOf(firework);
      theFireworks.splice(index, 1);
    } 
    else {
      firework.update();
      firework.display();
    }
  }
}

function mousePressed() {
  for (let i = 0; i < NUMBER_OF_FIREWORKS_PER_CLICK; i++) {
    let someFirework = new Particle(mouseX, mouseY);
    theFireworks.push(someFirework);
  }
}
