let stars = [];
let today = new Date();
let dates = []; // Array to store dates
let sampleZNumbers = [];
// let w = 1200;
// let h = 1200;
// let iter = 0;
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
  createCanvas(windowWidth, windowHeight);
  //nStars = sampleZNumbers.length
  fillArray();
  console.log(stars);
  for (let i = 0; i < stars.length; i++) {
    stars[i].makeConstellation(stars);
  }
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

// function perceivedCenter(stars) {
//   centerSumX = 0;
//   centerSumY = 0;
//   for (let i = 0; i < stars.length; i++) {
//     centerSumX += stars[i].pos.x;
//     centerSumY += stars[i].pos.y;
//   }
//   centerAvgX = centerSumX / stars.length;
//   centerAvgY = centerSumY / stars.length;
//   return createVector(centerAvgX, centerAvgY);
// }

function draw() {
  background(0);

  for (let i = 0; i < stars.length; i++) {
    stars[i].show();
    stars[i].update();
    stars[i].checkMouseOver();
    if (modal) {
      modal.show();
    }
    //stars[i].twinkel();
    // stars[i].mouseOver();

    //chase({ x: mouseX, y: mouseY }, stars[i], 1);
    //if(stars[i].isInside){
    //stars[i].moveTo(mouseX,mouseY)
    //}
  }

  // if (iter > 30) {
  //   iter = 0;
  // }
  // iter++;
  // zoom(iter);
}

// function zoom(i) {
//   stars[0].setRadius(i);
// }

// function chase(mouse, cat, speed) {
//   mouse.x = mouseX;
//   mouse.y = mouseX;
//   let rX = mouseX - cat.pos.x;
//   let rY = mouseY - cat.pos.y;

//   //step 2
//   let rlen = sqrt(rX ** 2 + rY ** 2);

//   //step 3
//   let uX = (1 / rlen) * rX;
//   let uY = (1 / rlen) * rY;

//   //step 4
//   cat.pos.x += speed * uX;
//   cat.pos.y += speed * uY;
// }

class Star {
  constructor(z) {
    this.ogZNumber = z;
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
      random([
        [0, 0, 255],
        [0, 255, 0],
        [255, 0, 0],
        [255, 255, 255],
        [255, 0, 255],
      ])
    ); //Generates a random color from the two RGB values 255 and 0. This leaves us with the following 8 possible colors: RGB(0, 0, 0)Black, (0, 0, 255)Blue, (0, 255, 0)Green, (0, 255, 255)Cyan, (255, 0, 0)Red, (255, 0, 255)Magenta, (255, 255, 0)Yellow, (255, 255, 255)White.
    this.constellation = [];
    this.isClicked = false;
    this.orbitRadius = random(90, 100);
  }

  makeConstellation(stars) {
    for (let i = 0; i < stars.length; i++) {
      if (
        stars[i] !== this &&
        stars[i].color.toString() === this.color.toString()
      ) {
        this.constellation.push(stars[i]);
        console.log("We belong together!");
      }
      console.log(this.constellation);
    }
  }

  setRadius(r) {
    this.radius = r;
  }

  moveTo(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }

  mouseOver() {
    let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    return d < this.radius;
  }
  engorge() {
    if (this.mouseOver() && this.radius < 20) {
      this.radius++;
      this.pos.z = 0;
    }
    for (let i = 0; i < this.constellation.length; i++) {
      // Update the angle for the current star
      this.constellation[i].angle += 0.001; // Adjust the speed as needed

      // Calculate the target position of the current star in its orbit
      let x = this.pos.x + this.orbitRadius * cos(this.constellation[i].angle);
      let y = this.pos.y + this.orbitRadius * sin(this.constellation[i].angle);
      let target = createVector(x, y);

      // Use the lerp function to move the current star towards the target position
      this.constellation[i].pos = p5.Vector.lerp(
        this.constellation[i].pos,
        target,
        0.03
      ); // Adjust the lerp factor as needed

      this.constellation[i].radius = this.radius;
      this.constellation[i].pos.z = this.pos.z;
      console.log(this.constellation[i].pos.z);
    }
  }
  // Deflate the star when mouse is not over
  deflate() {
    if (!this.mouseOver()) {
      this.radius = map(this.ogZNumber, 0, 100, 10, 1);
      this.pos.z = this.ogZNumber;

      // Generate a random target position for each star only if they don't already have one
      for (let i = 0; i < this.constellation.length; i++) {
        if (!this.constellation[i].target) {
          let x = random(width);
          let y = random(height);
          this.constellation[i].target = createVector(x, y);
        }
      }
    }
    for (let i = 0; i < this.constellation.length; i++) {
      // Use the lerp function to move the current star towards the target position
      this.constellation[i].pos = p5.Vector.lerp(
        this.constellation[i].pos,
        this.constellation[i].target,
        0.05
      ); // Adjust the lerp factor as needed
    }
  }

  checkMouseOver() {
    if (this.mouseOver()) {
      this.engorge();
    } else {
      this.deflate();
    }
  }

  // isOutside() {
  //   return dist(mouseX, mouseY, this.pos.x, this.pos.y) > this.radius;
  // }
  // isInside() {
  //   //let isLeftOf=p.mouseX <= this.xPos;
  //   //let isRightOf=p.mouseX >= (this.xPos+this.w);
  //   //let isBeneath=p.mouseY >= (this.yPos+this.h);
  //   //let isAbove=p.mouseY <= this.yPos;
  //   //return !isLeftOf && !isRightOf && !isBeneath && !isAbove;
  //   return dist(mouseX, mouseY, this.pos.x, this.pos.y) < this.radius;
  // }

  // cohesion(stars) {
  //   let pCenter;
  //   for (let i = 0; i < stars.length; i++) {
  //     if (this != stars[i]) {
  //       pCenter += createVector(stars[i].pos.x, stars[i].pos.y);
  //     }
  //   }
  //   pCenter = pCenter / (stars.length - 1);
  //   return (pCenter - createVector(this.pos.x, this.pos.y)) / 100;
  // }

  // seperation(stars, d) {
  //   let pCenter = createVector(0, 0);
  //   for (let i = 0; i < stars.length; i++) {
  //     if (this != stars[i]) {
  //       if (dist(stars[i].pos.x, stars[i].pos.y, this.pos.x, this.pos.y) < d)
  //         pCenter =
  //           pcenter -
  //           (createVector(stars[i].pos.x, stars[i].pos.y) -
  //             createVector(this.pos.x, this.pos.y));
  //     }
  //   }
  //   return pCenter;
  // }

  // alignment(stars, chgVelocity) {
  //   let pVelocity;
  //   for (let i = 0; i < stars.length; i++) {
  //     if (this != stars[i]) {
  //       pVelocity += G.velocity;
  //     }
  //   }
  //   pVelocity = pVelocity / (stars.length - 1);
  //   return (pVelocity - G.velocity) / chgVelocity;
  // }

  handleClick() {
    if (this.mouseOver()) {
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
    this.pos.x = (this.pos.x + xoffset + windowWidth) % windowWidth;
    this.pos.y = (this.pos.y + yoffset + windowHeight) % windowHeight;
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
    //this.twinkle();
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
    if (stars[i].mouseOver()) {
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
