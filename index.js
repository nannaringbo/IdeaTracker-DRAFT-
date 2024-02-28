import Star from "./star.js"; // Import your Star class

let stars = [];
let dates = []; // Array to store dates
let sampleZNumbers = [];

// Initialize p5.js sketch
let sketch = new p5((p) => {
  p.setup = setup;
  p.draw = draw;
});

// Load data
function preload(p) {
  // Use preload() function to load data before setup() is called
  p.loadStrings("TESTstar_data.txt", function (data) {
    dates = data.map((date) => new Date(date.trim()));
    console.log(dates); // Log the dates array to the console
    // Calculate sample z numbers here, inside the callback
    let today = new Date(); // Get today's date
    sampleZNumbers = dates.map((date) => {
      let difference = today - date;
      let calZ = Math.floor(difference / (1000 * 60 * 60 * 24)); // Return the calculated z number
      let zNumber = p.map(calZ, 0, 3500, 0, 100);
      return zNumber;
    });
    // Create stars after data is loaded
    for (let s = 0; s < sampleZNumbers.length; s++) {
      console.log(sampleZNumbers[s]);
      let star = new Star(p, sampleZNumbers[s]);
      console.log(star.radius);
      stars.push(star);
    }
  });
}

// Initialize p5.js sketch
function setup(p) {
  preload(this);
  this.createCanvas(this.windowWidth, this.windowHeight); // Create canvas
}

// Draw function
function draw(p) {
  this.background(0);

  for (let i = 0; i < stars.length; i++) {
    stars[i].show(this);
    stars[i].update();
  }
}
