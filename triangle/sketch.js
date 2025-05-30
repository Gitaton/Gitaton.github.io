/* eslint-disable indent */
// Sierpinski Triangle Demo
// Recursion -- But visual!
// Karthik Narayan
// May 30 2025

let intialTriangle = [
  {x: 800, y: 74},
  {x: 100, y: 700},
  {x: 1500, y: 700}
];

let theDepth = 0;
let theColors;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
  theColors = [color(0, 0, 10), color(0, 0, 30), color(0, 0, 50), color(0, 0, 70), color(0, 0, 100), color(0, 0, 130), color(0, 0, 170), color(0, 0, 200), color(0, 0, 200)];
  sierpinksi(intialTriangle, theDepth);
}

function draw() {
}

function mousePressed() {
  theDepth++;
  background(220);
  text(theDepth, 10, 10);
  sierpinksi(intialTriangle, theDepth);
}

function sierpinksi(verticies, depth) {
  fill(color(40 * depth, 9 * depth, 0 * depth));
  // Shell triangle
  triangle(verticies[0].x, verticies[0].y,
           verticies[1].x, verticies[1].y,
           verticies[2].x, verticies[2].y
    );

    if (depth > 0) {
      // Pattern -- Draw the three new triangles
      // Bottom Left
      sierpinksi([midpoint(verticies[0], verticies[1]),
                 verticies[1],
                 midpoint(verticies[1], verticies[2])],
                 depth - 1);

      // Top
      sierpinksi([midpoint(verticies[0], verticies[1]),
                 verticies[0],
                 midpoint(verticies[0], verticies[2])],
                 depth - 1);
      // Bottom
      sierpinksi([midpoint(verticies[1], verticies[2]),
                 verticies[2],
                 midpoint(verticies[0], verticies[2])],
                 depth - 1);
    }
}

function midpoint(vertex1, vertex2) {
  let midX = (vertex1.x + vertex2.x) / 2;
  let midY = (vertex1.y + vertex2.y) / 2;
  return {x: midX, y: midY};
}