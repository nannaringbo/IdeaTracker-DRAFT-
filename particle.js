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
      return Math.floor(difference / (1000 * 60 * 60 * 24)); // Return the calculated z number
    });

    //console.log(sampleZNumbers); // Log the sample z numbers array to the console
  });
}

function setup() {
  createCanvas(w, h);
  //nStars = sampleZNumbers.length
  fillArray(nStars);
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
    //stars[i].update();
    stars[i].twinkel();
    stars[i].mouseOver();
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
    this.radius = map(this.pos.z, 0, 3500, 10, 0.5); // Adjust radius based on depth
    this.alpha = random(50, 255);
    this.fadeAmount = random(1, 15);
    this.rotationSpeed = random(-0.01, 0.01);
    this.angle = random(-90, 90); // angle for rotation
    this.speed = random(-0.1, 0.1);
    //this.sensorousParam = This is what we track (and more if we want)
    this.from = color(255, this.alpha); // Start color (white with alpha)
    this.to = color(random(30, 80), this.alpha); // End color
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

  mouseOver() {
    console.log(this.radius, dist(mouseX, mouseY, this.pos.x, this.pos.y));
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

  update() {
    //this.angle += this.rotationSpeed;

    // Calculate new position based on angle and speed
    let xoffset = cos(this.angle) * this.speed;
    let yoffset = sin(this.angle) * this.speed;
    this.pos.x = (this.pos.x + xoffset + w) % w;
    this.pos.y = (this.pos.y + yoffset + h) % h;
  }

  twinkel() {
    // Update alpha and fade
    this.alpha -= this.fadeAmount;
    if (this.alpha < 30 || this.alpha > 254) {
      this.fadeAmount *= -0.8;
    }
  }

  show() {
    noStroke();

    // Define gradient colors

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
