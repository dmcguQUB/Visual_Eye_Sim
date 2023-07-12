 //create variables
 var canvas = document.getElementById("myCanvas");
 var ctx = canvas.getContext("2d");

 // mouse move listener
 document.addEventListener("mousemove", mouseMoveHandler, false);

 //create eyeballs
 var eyes = [
   {
     eyeball: { x: 200, y: 200, radius: 50 },
     pupil: { x: 200, y: 200, radius: 20 },
   },
   {
     eyeball: { x: 400, y: 200, radius: 50 },
     pupil: { x: 400, y: 200, radius: 20 },
   },
 ];

 //function to build one eye
 function drawEye(eye) {
   ctx.beginPath();
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

 //function to build one pupil
 function drawPupil(pupil) {
   ctx.beginPath();
   ctx.arc(pupil.x, pupil.y, pupil.radius, 0, Math.PI * 2);
   ctx.fillStyle = "rgba(0, 0, 0, 1)"; // black colour
   ctx.fill(); // fill in pupil
   ctx.stroke();
   ctx.closePath();
 }

 // function for pupil to track the mouse
 function mouseMoveHandler(e) {
   // get the X and Y coordinates of the mouse
   var mouseX = e.clientX - canvas.offsetLeft;
   var mouseY = e.clientY - canvas.offsetTop;

   // Get the center point between the eyes
   var centerX = (eyes[0].eyeball.x + eyes[1].eyeball.x) / 2;

   for (var i = 0; i < eyes.length; i++) {
     var eye = eyes[i];

     // Calculate the direction of the mouse from the center of the eyeball
     var dirX = mouseX - eye.eyeball.x;
     var dirY = mouseY - eye.eyeball.y;

     // Calculate the distance of the mouse from the center of the eyeball
     var distance = Math.sqrt(dirX * dirX + dirY * dirY);

     // Normalize the direction
     var dirNormX = dirX / distance;
     var dirNormY = dirY / distance;

     // Calculate the max distance the pupil can move inside the eyeball
     var maxPupilDistance = eye.eyeball.radius - eye.pupil.radius;

     // Calculate the effective distance the pupil should move (it can't move beyond the eyeball)
     var effectivePupilDistance = Math.min(distance, maxPupilDistance);

     // Check if the mouse X is within the boundaries (center of both eyes)
     if (mouseX > eyes[0].eyeball.x && mouseX < eyes[1].eyeball.x) {
       // If so, keep the pupil centered in the X direction
       eye.pupil.x = eye.eyeball.x;
     } else {
       // Otherwise, allow the pupil to move
       eye.pupil.x = eye.eyeball.x + dirNormX * effectivePupilDistance;
     }

     // Move the pupil in Y direction
     eye.pupil.y = eye.eyeball.y + dirNormY * effectivePupilDistance;
   }

   // Clear the previous drawing
   ctx.clearRect(0, 0, canvas.width, canvas.height);

   // Draw the eyes and pupils
   for (var i = 0; i < eyes.length; i++) {
     var eye = eyes[i];
     drawEye(eye);
     drawPupil(eye.pupil);
   }
 }