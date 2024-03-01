let stars = [];
let today = new Date();
let dates = []; // Array to store dates
let sampleZNumbers = [];
let w = 1200;
let h = 1200;
let iter = 0;
let nStars = 400;
let modal = null;

function preload() {
  // Use preload() function to load data before setup() is called
  loadStrings("TESTstar_data.txt", function (data) {
    dates = data.map((date) => new Date(date.trim()));
    //console.log(dates); // Log the dates array to the console
    // Calculate sample z numbers here, inside the callback
    let today = new Date(); // Get today's date
    sampleZNumbers = dates.map((date) => {
      let difference = today - date;
      let calZ = Math.floor(difference / (1000 * 60 * 60 * 24)); // Return the calculated z number
      let zNumber = map(calZ, 0, 3500, 0, 100);
      return zNumber;
    });

    //console.log(sampleZNumbers); // Log the sample z numbers array to the console
  });
}

function setup() {
  createCanvas(w, h);
  //nStars = sampleZNumbers.length
  fillArray();
}

function fillArray() {
  for (let s = 0; s < sampleZNumbers.length; s++) {
    //console.log(sampleZNumbers[s]);
    let p = new Star(sampleZNumbers[s]);
    //console.log(p);
    //console.log(p.radius);
    stars.push(p);
  }
}

function perceivedCenter(stars) {
  centerSumX = 0;
  centerSumY = 0;
  for (let i = 0; i < stars.length; i++) {
    centerSumX += stars[i].pos.x;
    centerSumY += stars[i].pos.y;
  }
  centerAvgX = centerSumX / stars.length;
  centerAvgY = centerSumY / stars.length;
  return createVector(centerAvgX, centerAvgY);
}

function draw() {
  background(0);

  for (let i = 0; i < stars.length; i++) {
    stars[i].show();
    stars[i].update();
    //stars[i].twinkel();
    stars[i].checkMouseOver();
    if (modal) {
      modal.show();
    }
    //stars[i].mouseOver();

    chase({ x: mouseX, y: mouseY }, stars[i], 1);
    //if(stars[i].isInside){
    //stars[i].moveTo(mouseX,mouseY)
    //}
  }

  if (iter > 30) {
    iter = 0;
  }
  iter++;
  zoom(iter);
}

function zoom(i) {
  stars[0].setRadius(i);
}

function chase(mouse, cat, speed) {
  mouse.x = mouseX;
  mouse.y = mouseX;
  let rX = mouseX - cat.pos.x;
  let rY = mouseY - cat.pos.y;

  //step 2
  let rlen = sqrt(rX ** 2 + rY ** 2);

  //step 3
  let uX = (1 / rlen) * rX;
  let uY = (1 / rlen) * rY;

  //step 4
  cat.pos.x += speed * uX;
  cat.pos.y += speed * uY;
}

class Star {
  constructor(z) {
    this.pos = createVector(random(0, w - 20), random(0, h - 20), z);
    this.radius = map(z, 0, 100, 10, 1); // Adjust radius based on depth
    this.alpha = random(50, 255);
    this.fadeAmount = random(1, 15);
    this.rotationSpeed = random(-0.0, 0.02);
    this.angle = random(-90, 90); // angle for rotation
    this.speed = random(-0.12, 0.12);
    this.color = color(random([255, 0]), random([255, 0]), 255, this.alpha); //Generates a random color from the two RGB values 255 and 0. This leaves us with the following 8 possible colors: RGB(0, 0, 0)Black, (0, 0, 255)Blue, (0, 255, 0)Green, (0, 255, 255)Cyan, (255, 0, 0)Red, (255, 0, 255)Magenta, (255, 255, 0)Yellow, (255, 255, 255)White.
    this.isClicked = false;
  }

  setRadius(r) {
    this.radius = r;
  }

  moveTo(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }

  engorge(p) {
    if (this.radius < 200) {
      this.radius++;
      this.pos.z = 0;
      //this.pos.x--
      //this.pos.y--
      //this.w+=2
      //this.h+=2
    }
  }

  deflate(p) {
    if (this.radius > 30) {
      this.radius--;
      //this.pos.x++
      //this.pos.x++
      //this.w-=2
      //this.h-=2
    }
  }

  clickMouseOver() {
    let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    return d < this.radius;
  }
  mouseOver() {
    //console.log(this.radius, dist(mouseX, mouseY, this.pos.x, this.pos.y));
    if (this.isInside()) {
      this.engorge();
    } else if (!this.isInside()) {
      this.deflate();
    }
  }

  isInside() {
    //let isLeftOf=p.mouseX <= this.xPos;
    //let isRightOf=p.mouseX >= (this.xPos+this.w);
    //let isBeneath=p.mouseY >= (this.yPos+this.h);
    //let isAbove=p.mouseY <= this.yPos;
    //return !isLeftOf && !isRightOf && !isBeneath && !isAbove;
    return dist(mouseX, mouseY, this.pos.x, this.pos.y) < this.radius;
  }

  cohesion(stars) {
    let pCenter;
    for (let i = 0; i < stars.length; i++) {
      if (this != stars[i]) {
        pCenter += createVector(stars[i].pos.x, stars[i].pos.y);
      }
    }
    pCenter = pCenter / (stars.length - 1);
    return (pCenter - createVector(this.pos.x, this.pos.y)) / 100;
  }

  seperation(stars, d) {
    let pCenter = createVector(0, 0);
    for (let i = 0; i < stars.length; i++) {
      if (this != stars[i]) {
        if (dist(stars[i].pos.x, stars[i].pos.y, this.pos.x, this.pos.y) < d)
          pCenter =
            pcenter -
            (createVector(stars[i].pos.x, stars[i].pos.y) -
              createVector(this.pos.x, this.pos.y));
      }
    }
    return pCenter;
  }

  alignment(stars, chgVelocity) {
    let pVelocity;
    for (let i = 0; i < stars.length; i++) {
      if (this != stars[i]) {
        pVelocity += G.velocity;
      }
    }
    pVelocity = pVelocity / (stars.length - 1);
    return (pVelocity - G.velocity) / chgVelocity;
  }
  checkMouseOver() {
    if (this.mouseOver()) {
      this.engorge();
    } else {
      this.deflate();
    }
  }

  handleClick() {
    if (this.clickMouseOver()) {
      this.isClicked = true;
      // Create and show the modal
      modal = new Modal(this);
      console.log("a modal was created!");
      modal.toggle();
    } else {
      this.isClicked;
    }
  }

  movement() {
    let xoffset = cos(this.angle) * this.speed;
    let yoffset = sin(this.angle) * this.speed;
    this.pos.x = (this.pos.x + xoffset + w) % w;
    this.pos.y = (this.pos.y + yoffset + h) % h;
  }

  twinkle() {
    // Update alpha and fade
    this.alpha -= this.fadeAmount;
    if (this.alpha < 30 || this.alpha > 254) {
      this.fadeAmount *= -0.8;
    }
  }

  update() {
    this.movement();
    this.twinkle();
  }

  show() {
    noStroke();

    // Define gradient colors

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
      circle(this.pos.x, this.pos.y, r * 2); // Draw ellipse with varying radius
    }
  }
}

// Loop through all stars and check if any are clicked

function mouseClicked() {
  let starClicked = false;
  for (let i = 0; i < stars.length; i++) {
    if (stars[i].clickMouseOver()) {
      stars[i].handleClick();
      starClicked = true;
    }
  }
  // If a star is not clicked, hide the currently active modal
  if (!starClicked && modal) {
    modal.hide();
    modal = null;
  }
}

//Modal (right now it is just a placeholder) for the pop-up with description/details about star
//Modal (right now it is just a placeholder) for the pop-up with description/details about star
class Modal {
  constructor(star) {
    this.belong = star.pos.z;
    this.starRadius = star.radius;
    this.isVisible = false;
    this.title = "Star Details";
    this.description =
      "This is a star with radius " +
      this.starRadius +
      " and z-position " +
      this.belong;
    this.bulletPoints = ["Point 1", "Point 2", "Point 3"]; // Replace with actual properties

    // Define the size and position of the modal
    this.width = 800;
    this.height = 500;
    this.x = (windowWidth - this.width) / 2;
    this.y = (windowHeight - this.height) / 2;

    // Define the size and position of the close button
    this.closeButtonSize = 20;
    this.closeButtonText = "X";
    this.closeButtonX = this.x + this.width - this.closeButtonSize;
    this.closeButtonY = this.y;
    this.color = star.color;
  }

  show() {
    if (this.isVisible) {
      noStroke();
      fill(color(this.color)); // Background color

      // Draw the modal
      rect(this.x, this.y, this.width, this.height);

      // Draw the title
      fill(color(0, 0, 0)); // Text color
      text(this.title, this.x + 10, this.y + 20);

      // Draw the description
      text(this.description, this.x + 10, this.y + 40);

      // Draw the bullet points
      for (let i = 0; i < this.bulletPoints.length; i++) {
        text("- " + this.bulletPoints[i], this.x + 10, this.y + 70 + i * 20);
      }
      let iconSize = 50;
      let iconMargin = 10;
      let iconY = this.y + 100;
      for (let i = 0; i < 4; i++) {
        let iconX = this.x + 10 + i * (iconSize + iconMargin);
        noFill();
        stroke(0);
        rect(iconX, iconY, iconSize, iconSize);
      }

      fill(color(255, 0, 0)); // Close button color
      rect(
        this.closeButtonX,
        this.closeButtonY,
        this.closeButtonSize,
        this.closeButtonSize
      );
    }
  }

  hide() {
    this.isVisible = false;
  }

  toggle() {
    this.isVisible = !this.isVisible;
  }

  clicked(x, y) {
    // Check if the close button was clicked
    if (
      x > this.closeButtonX &&
      x < this.closeButtonX + this.closeButtonSize &&
      y > this.closeButtonY &&
      y < this.closeButtonY + this.closeButtonSize
    ) {
      this.hide();
    }
  }
}
