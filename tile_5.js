import Star from "./star";

let stars = [];
let dates = []; // Array to store dates
let sampleZNumbers = [];

export const makeTile5 = function () {
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
      //stars[i].finished();
    }
  }
};
