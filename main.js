import Star from "./star.js";

let stars = [];
let today = new Date();
let dates = []; // Array to store dates
let sampleZNumbers = [];

// Preload function to load data before setup()
function preload() {
  // Use preload() function to load data before setup() is called
  this.loadStrings("TESTstar_data.txt", (data) => {
    dates = data.map((date) => new Date(date.trim()));
    // Calculate sample z numbers here, inside the callback
    today = new Date(); // Get today's date
    sampleZNumbers = dates.map((date) => {
      let difference = today - date;
      let differenceInDays = Math.floor(difference / (1000 * 60 * 60 * 24)); //converting the difference into days
      let zNumber = this.map(differenceInDays, 0, 3500, 0, 100); //calculating the z indexex (zNumber) by mapping over the differenceInDays and converting the value to fit into our number of layers
      return zNumber;
    });
  });
}

// Setup function to initialize the canvas and other settings
function setup() {
  this.createCanvas(this.windowWidth, this.windowHeight);
  for (let s = 0; s < sampleZNumbers.length; s++) {
    let star = new Star(this, sampleZNumbers[s]); // Pass 'this' (p) as the first argument
    //star.makeClickable(this); // Pass 'this' (p) to makeClickable
    stars.push(star);
  }
}

// Draw function to draw elements on the canvas
function draw() {
  this.background(0);
  for (let i = 0; i < stars.length; i++) {
    stars[i].show(this); // Pass 'this' (p) to the show method
    stars[i].update(this); // Pass 'this' (p) to the update method
  }
}

// Create a p5 instance and pass the preload, setup, and draw functions
new p5((p) => {
  p.preload = preload;
  p.setup = setup;
  p.draw = draw;
});
