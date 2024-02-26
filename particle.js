let particles = [];
let today = new Date();
let dates = []; // Array to store dates
let sampleZNumbers = [];

function preload() {
  // Use preload() function to load data before setup() is called
  loadStrings("star_data.txt", function (data) {
    dates = data.map((date) => new Date(date.trim()));
    console.log(dates); // Log the dates array to the console
    // Calculate sample z numbers here, inside the callback
    let today = new Date(); // Get today's date
    sampleZNumbers = dates.map((date) => {
      let difference = today - date;
      return Math.floor(difference / (1000 * 60 * 60 * 24)); // Return the calculated z number
    });

    console.log(sampleZNumbers); // Log the sample z numbers array to the console
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let s = 0; s < sampleZNumbers.length; s++) {
    console.log(sampleZNumbers[s]);
    let p = new Particle(sampleZNumbers[s]);
    console.log(p);
    console.log(p.radius);
    particles.push(p);
  }
}

function draw() {
  background(0);

  for (let i = 0; i < particles.length; i++) {
    particles[i].show();
    particles[i].update();
  }
}

class Particle {
  constructor(z) {
    this.pos = createVector(
      random(0, windowWidth - 20),
      random(0, windowHeight - 20),
      z
    );
    this.radius = map(z, 0, 3500, 7, 0.5); // Adjust radius based on depth
    this.alpha = random(50, 255);
    this.fadeAmount = random(1, 15);
    this.rotationSpeed = random(-0.2, 0.2);
    this.angle = random(-90, 90); // Initial angle for rotation
    this.speed = random(-0.12, 0.12); // Adjusted speed
    //this.sensorousParam = This is what we track (and more if we want)
    this.from = color(255, this.alpha); // Start color (white with alpha)
    this.to = color(random(50, 80), this.alpha); // End color (fully transparent white)
  }

  finished() {
    return this.alpha;
  }
  update() {
    //this.angle += this.rotationSpeed;

    // Calculate new position based on angle and speed
    let xoffset = cos(this.angle) * this.speed;
    let yoffset = sin(this.angle) * this.speed;
    this.pos.x = (this.pos.x + xoffset + windowWidth) % windowWidth;
    this.pos.y = (this.pos.y + yoffset + windowHeight) % windowHeight;

    // Update alpha and fade
    this.alpha -= this.fadeAmount;
    if (this.alpha < 30 || this.alpha > 254) {
      this.fadeAmount *= -0.8;
    }
  }

  show() {
    noStroke();

    // Define gradient colors

    // Draw gradient ellipse
    for (let r = 0; r <= this.radius; r++) {
      // Calculate alpha value based on distance from center
      let alpha = map(r, 0, this.radius, this.alpha, 0);
      let colorAtRadius = lerpColor(this.from, this.to, r / this.radius); // Interpolate between colors
      fill(
        red(colorAtRadius),
        green(colorAtRadius),
        blue(colorAtRadius),
        alpha
      );
      ellipse(this.pos.x, this.pos.y, r * 2); // Draw ellipse with varying radius
    }
  }
}
