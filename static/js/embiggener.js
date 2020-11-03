function embiggen(image) {
  const width = image.width / 2;
  const height = image.height / 2;
  canvas.width = width;
  canvas.height = height;

  ctx.save();
  // top left
  ctx.drawImage(image, 0, 0, width, height, 0, 0, width, height);
  const img1 = canvas.toDataURL();
  document.getElementById('output1').src = img1;

  const link1 = document.getElementById('link1');
  link1.href = img1;
  link1.download = `${filename}-topleft.png`;

  // top right
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  ctx.drawImage(image, image.width / 2, 0, width, height, 0, 0, width, height);
  const img2 = canvas.toDataURL();
  document.getElementById('output2').src = img2;
  const link2 = document.getElementById('link2');
  link2.href = img2;
  link2.download = `${filename}-topright.png`;

  // bottom left
  ctx.clearRect(0, 0, width, height);
  ctx.restore();

  ctx.drawImage(image, 0, image.height / 2, width, height, 0, 0, width, height);
  const img3 = canvas.toDataURL();
  document.getElementById('output3').src = img3;

  const link3 = document.getElementById('link3');
  link3.href = img3;
  link3.download = `${filename}-bottomleft.png`;

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
  const img4 = canvas.toDataURL();
  document.getElementById('output4').src = img4;
  const link4 = document.getElementById('link4');
  link4.href = img4;
  link4.download = `${filename}-bottomright.png`;
  document.getElementById('output').classList.remove('hidden');
}

function embiggenFormSubmit(event) {
  event.preventDefault();
  embiggen(img);
}
