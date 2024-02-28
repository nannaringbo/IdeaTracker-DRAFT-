let stars = [];
let today = new Date();
let dates = []; // Array to store dates
let sampleZNumbers = [];

function preload() {
  // Use preload() function to load data before setup() is called
  loadStrings("TESTstar_data.txt", function (data) {
    dates = data.map((date) => new Date(date.trim()));
    console.log(dates); // Log the dates array to the console
    // Calculate sample z numbers here, inside the callback
    let today = new Date(); // Get today's date
    sampleZNumbers = dates.map((date) => {
      let difference = today - date;
      let calZ = Math.floor(difference / (1000 * 60 * 60 * 24)); // Return the calculated z number
      let zNumber = map(calZ, 0, 3500, 0, 100);
      return zNumber;
    });

    console.log(sampleZNumbers); // Log the sample z numbers array to the console
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let s = 0; s < sampleZNumbers.length; s++) {
    console.log(sampleZNumbers[s]);
    let p = new Star(sampleZNumbers[s]);
    console.log(p);
    console.log(p.radius);
    stars.push(p);
  }
}

function draw() {
  background(0);

  for (let i = 0; i < stars.length; i++) {
    stars[i].show();
    stars[i].update();
  }
}

class Star {
  constructor(z) {
    this.pos = createVector(
      random(0, windowWidth - 20),
      random(0, windowHeight - 20),
      z
    );
    this.radius = map(z, 0, 100, 10, 1); // calculating radius based on the z index. The bigger the z index, the smaller the radius
    this.alpha = random(31, 250);
    this.fadeAmount = random(0.1, 7); //the amount that alpha is de/increased for every update
    this.rotationSpeed = random(-0.2, 0.2);
    this.angle = random(-90, 90); // Angle for rotation
    this.speed = random(-0.12, 0.12);
    this.color = color(
      random([255, 0]),
      random([255, 0]),
      random([255, 10]),
      this.alpha
    ); //Generates a random color from the two RGB values 255 and 0. This leaves us with the following 8 possible colors: RGB(0, 0, 0)Black, (0, 0, 255)Blue, (0, 255, 0)Green, (0, 255, 255)Cyan, (255, 0, 0)Red, (255, 0, 255)Magenta, (255, 255, 0)Yellow, (255, 255, 255)White.
  }

  isClicked() {
    return dist(mouseX, mouseY, this.pos.x, this.pos.y) < this.radius;
  }

  handleClick() {
    if (this.isClicked()) {
      // Create and show the modal
      let modal = new Modal(this);
      modal.show();
    }
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

function mouseClicked() {
  // Loop through all stars and check if any are clicked
  for (let i = 0; i < stars.length; i++) {
    stars[i].handleClick();
  }
}

class Modal {
  constructor(star) {
    this.belong = star.pos.z;
    this.starRadius = star.radius;
  }

  show() {
    noStroke();
    circle(50, 75, 20);
    fill(color(255, 167, 9)); // Example fill color (red)
    console.log(
      "You created a modal with the radius" +
        this.starRadius +
        " and " +
        this.belong
    );
  }

  hide() {
    // You can add logic here to hide the modal
  }
}
