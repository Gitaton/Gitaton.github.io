// Bubble Object Notation and Arrays Demo
// Karthik Narayan
// March.17, 2025

let theBubbles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  noStroke();

  // Add 10 bubbles to theBubbles
  for (let i = 0; i < 10; i++) {
    spawnBubble();
  }

  // Spawn a new bubble every half second
  window.setInterval(spawnBubble, 500);
}

function draw() {
  background(220);

  
  for (let bubble of theBubbles) {
    // Randomize movement -- too much coffee
    bubble.dx = random(-5, 5);
    bubble.dy = random(-5, 5);

    // Move bubble
    bubble.x += bubble.dx;
    bubble.y += bubble.dy;

    // Draw/Render each bubble
    fill(bubble.r, bubble.g, bubble.b);
    circle(bubble.x, bubble.y, bubble.radius * 2);
  }
}

function spawnBubble() {
  let someBubble = {
    x: random(width),
    y: random(height),
    radius: random(40, 80),
    r: random(255),
    g: random(255),
    b: random(255),
    dx: random(-5, 5),
    dy: random(-5, 5),
  };
  theBubbles.push(someBubble);
}

function mouseClicked() {
  for (let bubble of theBubbles) {

    // Checks distance from mouseX and every single bubble, I should use dist() next time
    let a = mouseX - bubble.x;
    let b = mouseY - bubble.y;
    if (Math.sqrt(a*a + b*b) < bubble.radius) {
      let index = theBubbles.indexOf(bubble);
      theBubbles.splice(index, 1);
    }
  }
}