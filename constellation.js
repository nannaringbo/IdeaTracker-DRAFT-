let stars = [];
let today = new Date();
let dates = []; // Array to store dates
let sampleZNumbers = [];
let w = 1200;
let h = 1200;
let iter = 0;
let nStars = 400;

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
  fillArray(nStars);
  for (let i = 0; i < stars.length; i++) {
    stars[i].makeConstellation(stars);
  }
}

function fillArray(n) {
  for (let s = 0; s < n; s++) {
    //console.log(sampleZNumbers[s]);
    let star = new Star(sampleZNumbers[s]);
    //console.log(star);
    //console.log(star.radius);
    stars.push(star);
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
    // stars[i].mouseOver();

    //chase({ x: mouseX, y: mouseY }, stars[i], 1);
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
  }

  makeConstellation(stars) {
    for (let i = 0; i < stars.length; i++) {
      if (
        stars[i] !== this &&
        stars[i].color.toString() === this.color.toString()
      ) {
        this.constellation.push(stars[i]);
        console.log("We belong together!");
        console.log(this.constellation);
      }
    }
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

  deflate() {
    if (this.isOutside) {
      this.radius = -1;
    }
  }

  // mouseOver() {
  //   //console.log(this.radius, dist(mouseX, mouseY, this.pos.x, this.pos.y));
  //   if (this.isInside()) {
  //     this.engorge();
  //   } else if (!this.isInside()) {
  //     this.deflate();
  //   }
  // }

  isOutside() {
    return dist(mouseX, mouseY, this.pos.x, this.pos.y) > this.radius;
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
  for (let i = 0; i < stars.length; i++) {
    stars[i].handleClick();
  }
}

function mouseMoved() {
  for (let i = 0; i < stars.length; i++) {
    if (stars[i].isInside()) {
      stars[i].engorge();
      for (let j = 0; j < stars[i].constellation.length; j++) {
        stars[i].constellation[j].engorge();
      }
    } else if (stars[i].isOutside() && stars[i].radius > 10) {
      stars[i].deflate();
      for (let j = 0; j < stars[i].constellation.length; j++) {
        stars[i].constellation[j].deflate();
      }
    }
  }
}

//Modal (right now it is just a placeholder) for the pop-up with description/details about star
class Modal {
  constructor(star) {
    this.belong = star.pos.z;
    this.starRadius = star.radius;
  }

  show() {
    noStroke();
    square(50, 75, 20);
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
