const Emoji = {
  fire: '🔥',
  done: '✅',
};

function reset(event) {
  event.target.reset();
  document.getElementById('download').classList.add('hidden');
  document.getElementById('output').src = '';
  document.getElementById('submit').setAttribute('disabled', 1);
}

async function statusify(event, image, status) {
  const { width, height } = getScaledImageDimensions(image.width, image.height);
  canvas.width = width;
  canvas.height = height;

  event.target.reset();
  if (status === 'red') {
    return makeRedVersion(image);
  }
  const emojiSize = canvas.width / 2;

  ctx.drawImage(image, 0, 0, width - width / 7, height - height / 7);
  // The size of the emoji is set with the font
  ctx.font = `70px serif`;
  ctx.textBaseline = 'top';
  ctx.fillText(Emoji[status], width - emojiSize, height - emojiSize);

  const output = document.getElementById('output');
  output.src = canvas.toDataURL();
  const downloadButton = document.getElementById('download');
  downloadButton.onclick = function (event) {
    downloadURI(output.src, `${filename}-${status}.png`);
  };
  downloadButton.classList.remove('hidden');
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
    const output = document.getElementById('output');
    output.src = canvas.toDataURL();
    const downloadButton = document.getElementById('download');
    downloadButton.onclick = function (event) {
      downloadURI(output.src, `${filename}-${status}.png`);
    };
    downloadButton.classList.remove('hidden');
  }
}
function statusFormSubmit(event) {
  event.preventDefault();
  const status = event.target[1].value;
  statusify(event, img, status);
}

document.getElementById('status-input').onchange = onImageSelect;
document.getElementById('form').onsubmit = statusFormSubmit;
document.getElementById('form').onreset = reset;
