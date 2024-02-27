class Star {
  constructor(z) {
    this.pos = createVector(
      random(0, windowWidth - 20),
      random(0, windowHeight - 20),
      z
    );
    this.radius = map(z, 0, 100, 10, 0.5); // calculating radius based on the z index. The bigger the z index, the smaller the radius
    this.alpha = random(31, 250);
    this.fadeAmount = random(0.1, 7); //the amount that alpha is de/increased for every update
    this.rotationSpeed = random(-0.2, 0.2);
    this.angle = random(-90, 90); // Angle for rotation
    this.speed = random(-0.12, 0.12);
    this.color = color(
      random([255, 0]),
      random([255, 0]),
      random([255, 0]),
      this.alpha
    ); //Generates a random color from the two RGB values 255 and 0. This leaves us with the following 8 possible colors: RGB(0, 0, 0)Black, (0, 0, 255)Blue, (0, 255, 0)Green, (0, 255, 255)Cyan, (255, 0, 0)Red, (255, 0, 255)Magenta, (255, 255, 0)Yellow, (255, 255, 255)White.
    this.makeClickable();
  }

  makeClickable() {
    addEventListener("click", (e) => {
      this.onClick();
    });
  }

  onClick() {
    testModal = new Modal();
    testmodal.show();
    //window.alert("This is your star!");
    console.log("you clicked a star with the radius: " + this.radius);
  }

  twinkle() {
    // Update alpha and fade
    this.alpha -= this.fadeAmount;
    if (this.alpha < 31 || this.alpha > 250) {
      this.fadeAmount *= -1;
    }
  }

  moveTo() {
    this.pos.z = 1;
  }

  movement() {
    // Calculate position based on angle and speed
    let xoffset = cos(this.angle) * this.speed;
    let yoffset = sin(this.angle) * this.speed;
    this.pos.x = (this.pos.x + xoffset + windowWidth) % windowWidth;
    this.pos.y = (this.pos.y + yoffset + windowHeight) % windowHeight;
  }

  // finished() {
  //   return this.alpha;
  // }
  update() {
    this.movement();
    this.twinkle();
  }

  show() {
    noStroke();

    for (let r = 0; r <= this.radius; r++) {
      // Calculate alpha value based on distance from center
      let alpha = map(r, 0, this.radius, this.alpha, 0);
      let colorAtRadius = lerpColor(this.color, this.color, 0.5); // Interpolate between colors

      fill(
        red(colorAtRadius),
        green(colorAtRadius),
        blue(colorAtRadius),
        alpha
      );
      circle(this.pos.x, this.pos.y, r * 2);
    }
  }
}
