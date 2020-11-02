function yeeify(image) {
  const { width, height } = image;
  const yeeCanvas = document.getElementById('yee-canvas');
  const body = document.getElementById('top');
  yeeCanvas.width = width + width / 2;
  yeeCanvas.height = height + height / 2;
  const yeeCtx = yeeCanvas.getContext('2d');

  let hatPositionX = 0;
  let hatPositionY = 0;
  let rotationAngle = 0;
  let rotationAngleInRad = 0;
  // draw the user uploaded image
  yeeCtx.drawImage(image, 0, height / 2, width, height);
  ctx.save();

  // draw the hat at 0,0
  const hat = document.getElementById('cowboy-hat');
  const hatHeight = (width / hat.width) * hat.height;
  hat.width = width;
  hat.height = hatHeight;
  yeeCtx.drawImage(hat, hatPositionX, hatPositionY, width, hatHeight);

  // get the offset of the canvas in relation to top of viewport
  const { left, top } = yeeCanvas.getBoundingClientRect();
  const offsetX = left;
  // subtract the amount we've scrolled, to get canvas offset from actual top
  const offsetY = top - body.scrollTop;

  let canvasWidth = yeeCanvas.width;
  let canvasHeight = yeeCanvas.height;
  let isDragging = false;

  function handleMouseDown(e) {
    canMouseX = parseInt(e.clientX - offsetX);
    canMouseY = parseInt(e.clientY - offsetY);
    // set the drag flag
    isDragging = true;
  }

  function handleMouseUp(e) {
    canMouseX = parseInt(e.clientX - offsetX);
    canMouseY = parseInt(e.clientY - offsetY);

    if (isDragging) {
      yeeCtx.clearRect(0, 0, width + width / 2, height + height / 2);
      yeeCtx.drawImage(image, 0, height / 2, width, height);
      yeeCtx.rotate(rotationAngleInRad); // we want to keep any angle we've rotated to
      yeeCtx.drawImage(hat, hatPositionX, hatPositionY, width, hatHeight);
    }
    // clear the drag flag
    isDragging = false;
  }

  function handleMouseOut(e) {
    canMouseX = parseInt(e.clientX - offsetX);
    canMouseY = parseInt(e.clientY - offsetY);
    // user has left the yeeCanvas, so clear the drag flag
    isDragging = false;
  }

  function handleMouseMove(e) {
    canMouseX = parseInt(e.clientX - offsetX);
    canMouseY = parseInt(e.clientY - offsetY);
    // if the drag flag is set, clear the canvas and draw the image
    if (isDragging) {
      hatPositionX = canMouseX - width / 2;
      hatPositionY = canMouseY - height / 2;

      // yeeCtx.restore();
      yeeCtx.clearRect(0, 0, width + width / 2, height + height / 2);
      yeeCtx.drawImage(image, 0, height / 2, width, height);
      yeeCtx.drawImage(hat, hatPositionX, hatPositionY, width, hatHeight);
    }
  }

  function rotate(deg) {
    rotationAngle = rotationAngle + deg;
    yeeCtx.save();
    yeeCtx.clearRect(0, 0, width + width / 2, height + height / 2);
    yeeCtx.drawImage(image, 0, height / 2, width, height);

    rotationAngleInRad = (rotationAngle * Math.PI) / 180;
    yeeCtx.rotate(rotationAngleInRad);
    yeeCtx.drawImage(hat, hatPositionX, hatPositionY, width, hatHeight);
    yeeCtx.restore();
  }
  document
    .getElementById('scale-up')
    .addEventListener('click', function (e) {});
  document
    .getElementById('scale-down')
    .addEventListener('click', function (e) {});
  document.getElementById('rotate-l').addEventListener('click', function (e) {
    rotate(-10);
  });
  document.getElementById('rotate-r').addEventListener('click', function (e) {
    rotate(10);
  });

  yeeCanvas.addEventListener('mousedown', function (e) {
    handleMouseDown(e);
  });
  yeeCanvas.addEventListener('mousemove', function (e) {
    handleMouseMove(e);
  });
  yeeCanvas.addEventListener('mouseup', function (e) {
    handleMouseUp(e);
  });
  yeeCanvas.addEventListener('mouseout', function (e) {
    handleMouseOut(e);
  });
}

function yeeFormSubmit(event) {
  event.preventDefault();
  yeeify(img);
}
