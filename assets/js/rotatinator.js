function rotate(image, speed = 1) {
  const widthAndHeight = getScaledImageDimensions(image.width, image.height);
  const width = widthAndHeight.width;
  const height = widthAndHeight.height;
  const canvasWidth = width + width / 2;
  const canvasHeight = height + width / 2;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  const numSteps = 30 / parseFloat(speed);

  const rotationInDegrees = 360 / numSteps;
  var gif = new GIF({
    workers: 2,
    repeat: 0,
    quality: 10,
    width: canvasWidth,
    height: canvasHeight,
    transparent: true,
    workerScript:
      window.location.protocol +
      '//' +
      window.location.host +
      '/js/gif.worker.min.js',
  });

  gif.on('finished', function (blob) {
    document.getElementById('output').src = URL.createObjectURL(blob);
    gif.freeWorkers.forEach((w) => w.terminate());
  });

  for (let i = 0; i < numSteps; i++) {
    console.log({ i });
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.save();

    ctx.translate(canvasWidth / 2, canvasHeight / 2); // set canvas context to centre
    ctx.rotate(i * (rotationInDegrees * (Math.PI / 180)));
    try {
      ctx.drawImage(image, -width / 2, -height / 2, width, height);
      gif.addFrame(ctx, { delay: 0.5, copy: true });
    } catch (err) {
      console.error(error);
      break;
    }
    ctx.restore();
  }
  gif.render();
}
function rotatorFormSubmit(event) {
  event.preventDefault();
  const speed = event.target[1].value;
  rotate(img, speed);
}

async function onImageSelect(event, img) {
  const image = event.target.files[0];
  const src = await toBase64(image);
  img.src = src;
  img.onload = () => {
    document.getElementById('submit').removeAttribute('disabled');
  };
}
