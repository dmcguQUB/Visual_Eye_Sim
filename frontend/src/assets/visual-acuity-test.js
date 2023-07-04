  // Declare a global variable `zoomLevel` to track the current zoom level.
    // Initially, it's set to 1 representing the original size of the image.
    var zoomLevel = 1;

    // Get the DOM object representing the Snellen chart image using its id.
    // This object provides us access to manipulate the image properties.
    var chart = document.getElementById("snellenChart");

    // Get the original width of the Snellen chart image and store it in `baseWidth`.
    // This will serve as our reference point for all zoom operations.
    var baseWidth = chart.clientWidth;

    // Add a click event listener to the button with id "zoomIn".
    // The listener calls the `zoom` function with parameter 1.1 when the button is clicked.
    // This means, whenever the "zoomIn" button is clicked, the image is zoomed in by 10%.
    document.getElementById("zoomIn").addEventListener("click", function () {
      zoom(1.1);
    });

    // Add a click event listener to the button with id "zoomOut".
    // The listener calls the `zoom` function with parameter 0.9 when the button is clicked.
    // This means, whenever the "zoomOut" button is clicked, the image is zoomed out by 10%.
    document.getElementById("zoomOut").addEventListener("click", function () {
      zoom(0.9);
    });

    // Define the `zoom` function that takes a zoom factor as input.
    // This function is responsible for adjusting the zoom level and resizing the image.
    function zoom(factor) {
      // Multiply the current zoom level with the zoom factor to get the new zoom level.
      // If the factor is greater than 1, it zooms in (increases the size), if less than 1, it zooms out (decreases the size).
      zoomLevel *= factor;

      // Calculate the new width of the image by multiplying the base width with the new zoom level.
      var newWidth = baseWidth * zoomLevel;

      // Apply the new width to the Snellen chart image.
      // This adjusts the size of the image based on the zoom level.
      chart.style.width = newWidth + "px";
    }