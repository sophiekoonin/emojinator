function embiggen(image) {
  const width = image.width / 2;
  const height = image.height / 2;
  canvas.width = width;
  canvas.height = height;

  ctx.save();
  // top left
  ctx.drawImage(image, 0, 0, width, height, 0, 0, width, height);
  document.getElementById('output1').src = canvas.toDataURL();
  // top right
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  ctx.drawImage(image, image.width / 2, 0, width, height, 0, 0, width, height);
  document.getElementById('output2').src = canvas.toDataURL();
  // bottom left
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  ctx.drawImage(image, 0, image.height / 2, width, height, 0, 0, width, height);
  document.getElementById('output3').src = canvas.toDataURL();
  // bottom right
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  ctx.drawImage(
    image,
    image.width / 2,
    image.height / 2,
    width,
    height,
    0,
    0,
    width,
    height
  );
  document.getElementById('output4').src = canvas.toDataURL();
}

function embiggenFormSubmit(event) {
  event.preventDefault();
  embiggen(img);
}
