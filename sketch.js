function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create particles
  for (let i = 0; i < 100; i++) {
    stars.push(new Star());
  }
}

function draw() {
  background(0);
  translate(width / 2, height / 2); // Center the coordinate system

  // Sort particles based on z-coordinate to create depth effect
  stars.sort((a, b) => a.pos.z - b.pos.z);

  // Update and display particles
  for (let i = 0; i < stars.length; i++) {
    stars[i].update();
    stars[i].display();
  }
}
