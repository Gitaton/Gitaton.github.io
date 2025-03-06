// Bouncing Ball Object Demo
// Karthik Narayan
// March 5, 2025

let ballArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  spawnBall();
}

function draw() {
  background(220);

  for (let ball of ballArray) {
    moveBalls(ball);
    displayBalls(ball);
  }
}

function moveBalls(ball) {
  // Move Ball
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Teleport around edge of screen
  if (ball.x - ball.radius > width) {
    // Off right side
    ball.x = -ball.radius;
  }
  else if (ball.x + ball.radius < 0) {
    // Off left side
    ball.x = width + ball.radius;
  }
  if (ball.y - ball.radius > height) {
    // Off Bottom
    ball.y = -ball.radius;
  }
  else if (ball.y + ball.radius < 0) {
    // Of top
    ball.y = height + ball.radius;
  }
}

function displayBalls(ball) {
  // Display ball
  noStroke();
  fill("red");
  circle(ball.x, ball.y, ball.radius * 2);
}

function mousePressed() {
  spawnBall();
}

function spawnBall() {
  let someBall = {
    x: random(width),
    y: random(height),
    radius: random(40, 200),
    dx: random(-5, 5),
    dy: random(-5, 5),
  };
  ballArray.push(someBall);
}
