// Define array to hold line objects
let lines = [];
let NUM_LINES = 100;
let LINE_LENGTH = 8; 

function p5setup() {
  createCanvas(windowWidth/2, windowHeight, hurricane); // create a canvas half the size of the screen
  angleMode(DEGREES);
  // Create lines objects
  for (let i = 0; i < NUM_LINES; i++) {
    // Add a new line object to the array
    lines.push(new Line());
  }
}
function draw() {
  background('#092629');

  // Update and display each line in the array
  let currentTime = frameCount / 60;

  for (let line of lines) {
    // Update each line position and display
    // line.update(currentTime);
    line.display();
  }
  // console.log(lines[0].x1 + "," +lines[0].y1);
}

class Line { // Define the line class
  constructor() {
    this.posX = random(LINE_LENGTH, width);;
    this.posY = random(0, height);
    this.initialAngle = random(0, 360);
    this.x1 = this.posX - LINE_LENGTH/2; 
    this.y1 = this.posY - LINE_LENGTH/2;
    this.x2 = this.posX + LINE_LENGTH/2;
    this.y2 = this.posY + LINE_LENGTH/2;
  }

  update(time) {
    // Define angular speed (degrees / second)

    // Calculate the current angle
    // let angle = this.initialAngle + angularSpeed * time;
    let speed = 5;
    let iniX1 = this.x1;
    let iniX2 = this.x2;
    let iniY1 = this.y1;
    let iniY2 = this.y2;
     
    this.x1 =  10 * sin(speed) + iniX1; 
    this.y1 =  10 * sin(speed) + iniY1;
    // this.x2 =  -10 * sin(speed) + iniX2; 
    // this.y2 =  -10 * sin(speed) + iniY2;
    // x position follows a sine wave
    // this.x1 = this.x1 + sin() * 3;
    // this.y1 += height * noise(0.005);
    // this.x2 += width * noise(0.005);
    // this.y2 += height * noise(0.005);

    // Different size lines fall at different y speeds
    // let ySpeed = 8 / this.size;
    // this.posY += ySpeed;
  }
  display() {
    stroke('magenta');
    strokeWeight(1);
    line(this.x1, this.y1, this.x2, this.y2);
  }
}