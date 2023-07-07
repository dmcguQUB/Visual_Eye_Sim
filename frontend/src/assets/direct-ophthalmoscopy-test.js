document.addEventListener('mousemove', function(e) {
  let maskCircle = document.getElementById('maskCircle');
  let x = e.clientX;
  let y = e.clientY;
  maskCircle.setAttribute('cx', x + 'px');
  maskCircle.setAttribute('cy', y + 'px');
});