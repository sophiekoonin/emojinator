async function statusify(image, status) {
  const { width, height } = getScaledImageDimensions(image.width, image.height);
  canvas.width = width;
  canvas.height = height;

  const emoji = document.getElementById(status);
  const emojiSize = canvas.width / 2;
  ctx.drawImage(image, 0, 0, width, height);
  ctx.drawImage(
    emoji,
    width - emojiSize,
    height - emojiSize,
    emojiSize,
    emojiSize
  );
  ctx.save();
  document.getElementById('output').src = canvas.toDataURL();
}

function statusFormSubmit(event) {
  event.preventDefault();
  const status = event.target[1].value;
  statusify(img, status);
}
