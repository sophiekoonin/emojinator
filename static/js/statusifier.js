async function statusify(image, status) {
  const { width, height } = getScaledImageDimensions(image.width, image.height);
  canvas.width = width;
  canvas.height = height;

  if (status === 'red') {
    return makeRedVersion(image);
  }

  ctx.drawImage(image, 0, 0, width - width / 6, height - height / 6);
  const emoji = document.getElementById(status);
  const emojiSize = canvas.width / 2;
  ctx.drawImage(
    emoji,
    width - emojiSize,
    height - emojiSize,
    emojiSize,
    emojiSize
  );

  document.getElementById('output').src = canvas.toDataURL();

  function makeRedVersion(image) {
    ctx.drawImage(image, 0, 0, width, height);

    let imgData = ctx.getImageData(0, 0, width, height),
      x,
      y,
      i,
      grey;

    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        i = (y * width + x) * 4;

        grey = window.parseInt(
          0.2125 * imgData.data[i] +
            0.7154 * imgData.data[i + 1] +
            0.0721 * imgData.data[i + 2],
          10
        );

        imgData.data[i] += grey - imgData.data[i];
        imgData.data[i + 1] += grey - imgData.data[i + 1];
        imgData.data[i + 2] += grey - imgData.data[i + 2];
      }
    }
    ctx.putImageData(imgData, 0, 0);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = '#cc0000';
    ctx.globalAlpha = 0.6;
    ctx.fillRect(0, 0, width, height);
    document.getElementById('output').src = canvas.toDataURL();
  }
}
function statusFormSubmit(event) {
  event.preventDefault();
  const status = event.target[1].value;
  statusify(img, status);
}
