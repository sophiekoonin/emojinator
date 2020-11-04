function embiggen(image) {
  const { width: scaledWidth, height: scaledHeight } = getScaledImageDimensions(
    image.width,
    image.height
  );

  const segmentWidth = scaledWidth / 2;
  const segmentHeight = scaledHeight / 2;
  canvas.width = segmentWidth;
  canvas.height = segmentHeight;

  /*
  ctx.drawImage(
    image,
    source-x, - this moves the "lens" horizontally
    source-y, - moves the "lens" vertically
    source-width - the actual image width halved,
    source-height - actual image height halved,
    dest-x, - always 0
    dest-y,  - always 0
    dest-width - output image width,
    dest-height- output image height
  )

  source + dest height will always be the same 
  */

  ctx.save();
  // top left
  ctx.drawImage(
    image,
    0,
    0,
    image.width / 2,
    image.height / 2,
    0,
    0,
    segmentWidth,
    segmentHeight
  );
  const img1 = canvas.toDataURL();
  document.getElementById('output1').src = img1;

  const link1 = document.getElementById('link1');
  link1.href = img1;
  link1.download = `${filename}-topleft.png`;

  // top right
  ctx.clearRect(0, 0, segmentWidth, segmentHeight);
  ctx.restore();

  ctx.drawImage(
    image,
    image.width / 2,
    0,
    image.width / 2,
    image.height / 2,
    0,
    0,
    segmentWidth,
    segmentHeight
  );
  const img2 = canvas.toDataURL();
  document.getElementById('output2').src = img2;
  const link2 = document.getElementById('link2');
  link2.href = img2;
  link2.download = `${filename}-topright.png`;

  // bottom left
  ctx.clearRect(0, 0, segmentWidth, segmentHeight);
  ctx.restore();

  ctx.drawImage(
    image,
    0,
    image.height / 2,
    image.width / 2,
    image.height / 2,
    0,
    0,
    segmentWidth,
    segmentHeight
  );
  const img3 = canvas.toDataURL();
  document.getElementById('output3').src = img3;

  const link3 = document.getElementById('link3');
  link3.href = img3;
  link3.download = `${filename}-bottomleft.png`;

  // bottom right
  ctx.clearRect(0, 0, segmentWidth, segmentHeight);
  ctx.restore();

  ctx.drawImage(
    image,
    image.width / 2,
    image.height / 2,
    image.width / 2,
    image.height / 2,
    0,
    0,
    segmentWidth,
    segmentHeight
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

document.getElementById('embiggen-input').onchange = onImageSelect;
document.getElementById('embiggen-form').onsubmit = embiggenFormSubmit;
