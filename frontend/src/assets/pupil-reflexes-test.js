// create variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// mouse move listener
canvas.addEventListener("mousemove", mouseMoveHandler, false);

// create eyeballs
var eyes = [
  {
    eyeball: { x: 100, y: 100, radius: 50 },
    pupil: { x: 100, y: 100, radius: 20, targetRadius: 20 },
  },
  {
    eyeball: { x: 300, y: 100, radius: 50 },
    pupil: { x: 300, y: 100, radius: 20, targetRadius: 20 },
  },
];

// function to build one eye
function drawEye(eye) {
  ctx.beginPath();
  // arc method in HTML to draw a circle 
  ctx.arc(
    eye.eyeball.x,
    eye.eyeball.y,
    eye.eyeball.radius,
    0,
    Math.PI * 2
  );
  ctx.strokeStyle = "rgba(0, 0, 0, 1)"; // black colour
  ctx.stroke();
  ctx.closePath();
}

// function to build one pupil
function drawPupil(pupil) {
  ctx.beginPath();
  ctx.arc(pupil.x, pupil.y, pupil.radius, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 0, 0, 1)"; // black colour
  ctx.fill(); // fill in pupil
  ctx.stroke();
  ctx.closePath();
}

var mouseX = 0;
var mouseY = 0;

// function for pupil to constrict on hover and torch light animation
function mouseMoveHandler(e) {
  var header = document.querySelector('app-header'); // Get a reference to the Angular header component
  var headerHeight = header.offsetHeight; // Get the height of the header

  // get the X and Y coordinates of the mouse
  mouseX = e.clientX - canvas.offsetLeft;
  mouseY = e.clientY - canvas.offsetTop - headerHeight; // Subtract the height of the header

  //animation for torch light
  var gradient = ctx.createRadialGradient(mouseX, mouseY, 10, mouseX, mouseY, 300);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)"); // white color
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // fully transparent color

  // Check if mouse is over any eye
  var mouseIsOverAnyEye = false;
  for (var i = 0; i < eyes.length; i++) {
    var eye = eyes[i];
    var distX = mouseX - eye.pupil.x;
    var distY = mouseY - eye.pupil.y;
    var distance = Math.sqrt(distX * distX + distY * distY); // Calculate Euclidean distance between mouse position and pupil center
    if (distance < eye.pupil.radius) {
      mouseIsOverAnyEye = true;
      break;
    }
  }

  // Set target radius of all pupils based on whether mouse is over any eye
  for (var i = 0; i < eyes.length; i++) {
    var eye = eyes[i];
    if (mouseIsOverAnyEye) {
      // If so, set the target radius to the constricted size
      eye.pupil.targetRadius = 10;
    } else {
      // Otherwise, set the target radius to the normal size
      eye.pupil.targetRadius = 20;
    }
  }

  // Start the animation
  window.requestAnimationFrame(drawScene);
}

//draw light beam
var lightWidth = 20; // width of the light beam
var lightHeight = 20; // height of the light beam

function drawScene() {
  // Clear the previous drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // For each eye, gradually adjust the radius of the pupil towards the target radius
  for (var i = 0; i < eyes.length; i++) {
    var eye = eyes[i];

    if (eye.pupil.radius < eye.pupil.targetRadius) {
      eye.pupil.radius += 0.2;
    } else if (eye.pupil.radius > eye.pupil.targetRadius) {
      eye.pupil.radius -= 0.2;
    }

    // Redraw the eye and pupil
    drawEye(eye);
    drawPupil(eye.pupil);
  }


  // Draw torch light
  var gradient = ctx.createRadialGradient(mouseX, mouseY, 10, mouseX, mouseY, 40);
  gradient.addColorStop(0, "rgba(255, 255, 0, 1)"); // white color
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)"); // fully transparent color

  ctx.beginPath();
  ctx.arc(mouseX, mouseY, 20, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();
}

// Initial scene drawing
drawScene();
