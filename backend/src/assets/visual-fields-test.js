//create variables
var canvas = document.getElementById("myCanvas");
canvas.width = document.getElementById("canvasContainer").offsetWidth;
canvas.height = document.getElementById("canvasContainer").offsetHeight;
var ctx = canvas.getContext("2d");
// mouse move listener
canvas.addEventListener("mousemove", mouseMoveHandler, false);

//create face
var face = {
  x: canvas.width / 2,  // center of the canvas
  y: 400,
  radiusX: 300,
  radiusY: 300,
  rotation: 0,
};

//create eyeballs
var eyes = [
  {
    eyeball: { x: (canvas.width / 2) - 100, y: 200, radius: 50 },
    pupil: { x: (canvas.width / 2) - 100, y: 200, radius: 20, targetRadius: 20 },
  },
  {
    eyeball: { x: (canvas.width / 2) + 100, y: 200, radius: 50 },
    pupil: { x: (canvas.width / 2) + 100, y: 200, radius: 20, targetRadius: 20 },
  },
];

//create rectangles to represent the visual fields
var rectangles = [
  {
    x: 20,
    y: 20,
    width: (canvas.width / 2),
    height: (canvas.height / 2),
    fill: "rgba(0, 0, 255, 0.5)",
  }, // top left
  {
    x: (canvas.width / 2)+20,
    y: 20,
    width: (canvas.width / 2),
    height: (canvas.height / 2),
    fill: "rgba(0, 0, 255, 0.5)",
  }, // top right
  {
    x: 20,
    y: (canvas.height / 2)+20,
    width: (canvas.width / 2),
    height: (canvas.height / 2),
    fill: "rgba(0, 0, 255, 0.5)",
  }, // bottom left
  {
    x: (canvas.width / 2)+20,
    y: (canvas.height / 2)+20,
    width: (canvas.width / 2),
    height: (canvas.height / 2),
    fill: "rgba(0, 0, 255, 0.5)",
  }, // bottom right
];


//function to build rectangles to represent visual fields
function drawRectangle(rect) {
  ctx.fillStyle = rect.fill;
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
}

//function to build face
function drawFace(face) {
  ctx.beginPath();
  ctx.ellipse(
    face.x,
    face.y,
    face.radiusX,
    face.radiusY,
    face.rotation,
    0,
    Math.PI * 2
  );
  ctx.stroke();
  ctx.closePath();
}

//function to build one eye
function drawEye(eye) {
  ctx.beginPath();
  //arc method in HTML to draw a circle
  ctx.arc(
    eye.eyeball.x,
    eye.eyeball.y,
    eye.eyeball.radius,
    0,
    Math.PI * 2
  );
  ctx.strokeStyle = "rgba(0, 0, 0, 1)"; // black color
  ctx.stroke();
  ctx.closePath();
}

//function to build one pupil
function drawPupil(pupil) {
  ctx.beginPath();
  ctx.arc(pupil.x, pupil.y, pupil.radius, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 0, 0, 1)"; // black color
  ctx.fill(); // fill in pupil
  ctx.stroke();
  ctx.closePath();
}

// function to highlight visual field when hovering over rectangle
function mouseMoveHandler(e) {
  // get the X and Y coordinates of the mouse
  var rect = canvas.getBoundingClientRect();
  var mouseX = e.clientX - rect.left;
  var mouseY = e.clientY - rect.top;

  // Check if the mouse is over any rectangle
  rectangles.forEach(function (rect) {
    // Reset color
    rect.fill = "rgba(0, 0, 255, 0.5)";

    // Check if mouse is within rectangle boundaries
    if (
      mouseX > rect.x &&
      mouseX < rect.x + rect.width &&
      mouseY > rect.y &&
      mouseY < rect.y + rect.height
    ) {
      rect.fill = "rgba(255, 0, 0, 0.5)"; // Change color to red if mouse is over
    }
  });

  // Start the animation
  window.requestAnimationFrame(animation);
}

function getHeaderHeight() {
  var header = document.querySelector("header");
  return header ? header.offsetHeight : 0;
}

function animation() {
  // Clear the previous drawing
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // For each eye, gradually adjust the radius of the pupil towards the target radius
  for (var i = 0; i < eyes.length; i++) {
    var eye = eyes[i];

    if (eye.pupil.radius < eye.pupil.targetRadius) {
      eye.pupil.radius += 0.004;
    } else if (eye.pupil.radius > eye.pupil.targetRadius) {
      eye.pupil.radius -= 0.004;
    }

    // Draw rectangles
    rectangles.forEach(drawRectangle);
    // Draw the face
    drawFace(face);
    // Redraw the eye and pupil
    drawEye(eye);
    drawPupil(eye.pupil);
  }

  // Continue the animation
  window.requestAnimationFrame(animation);
}

// Start the animation
window.requestAnimationFrame(animation);
var buttons = [
  "topLeftButton",
  "topRightButton",
  "bottomLeftButton",
  "bottomRightButton",
];
var message = document.getElementById("message");

function showMessage(event) {
  message.textContent = event.target.id + " clicked!";
}

buttons.forEach(function (id) {
  var button = document.getElementById(id);
  button.addEventListener("click", showMessage, false);
});