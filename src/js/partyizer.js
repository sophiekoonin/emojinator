// With heartfelt thanks to Ændrew Rininsland for the partyizer code
// https://github.com/aendrew/party-everything

const PARROT_COLORS = [
  '#FDD58E',
  '#8CFD8E',
  '#8CFFFE',
  '#8DB6FB',
  '#D690FC',
  '#FD90FD',
  '#FD6EF4',
  '#FC6FB6',
  '#FD6A6B',
  '#FD8E8D',
];

function reset(event) {
  event.target.reset();
  document.getElementById('download').classList.add('hidden');
  document.getElementById('output').src = '';
  document.getElementById('submit').setAttribute('disabled', 1);
}

function partyize(event, image) {
  const { width, height } = getScaledImageDimensions(image.width, image.height);
  canvas.width = width;
  canvas.height = height;

  var gif = new GIF({
    workers: 2,
    repeat: 0,
    quality: 10,
    width,
    height,
    transparent: true,
    workerScript:
      window.location.protocol +
      '//' +
      window.location.host +
      '/js/gif.worker.min.js',
  });
  gif.on('finished', function (blob) {
    const output = document.getElementById('output');
    output.src = URL.createObjectURL(blob);
    const downloadButton = document.getElementById('download');
    downloadButton.onclick = function (event) {
      downloadURI(output.src, `party${filename}.png`);
    };
    downloadButton.classList.remove('hidden');
    gif.freeWorkers.forEach((w) => w.terminate());
  });

  for (const base of PARROT_COLORS) {
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = base;
    ctx.globalAlpha = 0.4;
    ctx.fillRect(0, 0, width, height);
    gif.addFrame(ctx, { delay: 8, copy: true });
    ctx.restore();
  }
  gif.render();
}

function partyizerFormSubmit(event) {
  event.preventDefault();
  partyize(event, img);
}

document.getElementById('party-input').onchange = onImageSelect;
document.getElementById('form').onsubmit = partyizerFormSubmit;
document.getElementById('form').onreset = reset;
