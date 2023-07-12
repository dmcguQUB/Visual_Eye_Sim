document.addEventListener('mousemove', function(e) {
  const maskCircle = document.getElementById('maskCircle');
  const maskSvg = document.getElementById('maskSvg');
  
  // Get the bounding rectangle of the SVG.
  const svgRect = maskSvg.getBoundingClientRect();
  
  // Calculate the mouse position relative to the SVG.
  const x = e.clientX - svgRect.left;
  const y = e.clientY - svgRect.top;
  
  // Update the circle's position.
  maskCircle.setAttribute('cx', x + 'px');
  maskCircle.setAttribute('cy', y + 'px');
});
