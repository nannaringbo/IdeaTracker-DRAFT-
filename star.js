let stars = [];

FileReader();
class Star {
  constructor() {
    this.pos = createVector(
      random(-width / 2, width / 2),
      random(-height / 2, height / 2),
      map(frameCount % 1000, 0, 1000, -500, 500)
    ); // Random coordinates for where the "star" is positioned. Last one is the z-position, which we use framCount for, which is a part of the P5 library (look into documentation)
    this.radius = random(2, 8); // Random radius
    this.color = color(random(255), random(255), random(255)); // Random color
  }

  update() {
    if (this.pos.x > width / 2) this.pos.x = -width / 2;
    else if (this.pos.x < -width / 2) this.pos.x = width / 2;
    if (this.pos.y > height / 2) this.pos.y = -height / 2;
    else if (this.pos.y < -height / 2) this.pos.y = height / 2;
  }

  display() {
    noStroke();
    fill(this.color);
    let size = map(this.pos.z, -500, 500, 8, 2); // Map size based on depth
    ellipse(this.pos.x, this.pos.y, size, size);
  }
}
