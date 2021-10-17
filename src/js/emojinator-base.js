const MAX_GIF_SIZE = 128;
const MAX_SIZE = 480;
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
const outputElement = document.getElementById('output')
const canvasContainer = document.getElementById('canvas')
let filename = '';

function scaleDimensions(longerSide, shorterSide, maxSize) {
  const longScaled = Math.min(longerSide, maxSize);
  const shortScaled = (longScaled / longerSide) * shorterSide;
  return [longScaled, shortScaled];
}

function getScaledImageDimensions(width = MAX_GIF_SIZE, height = MAX_GIF_SIZE, maxSize = MAX_GIF_SIZE) {
  const imageAspectRatio = width / height;
  // width < height
  if (imageAspectRatio < 1) {
    const [newHeight, newWidth] = scaleDimensions(height, width, maxSize);

    return {
      width: newWidth,
      height: newHeight,
    };
  }

  // width > height
  if (imageAspectRatio > 1) {
    const [newWidth, newHeight] = scaleDimensions(width, height, maxSize);

    return {
      width: newWidth,
      height: newHeight,
    };
  }

  // width = height
  const newSize = Math.max(Math.min(width, maxSize), MAX_GIF_SIZE);
  return {
    width: newSize,
    height: newSize,
  };
}

async function onImageSelect(event) {
  const image = event.target.files[0];
  filename = event.target.files[0].name.split('.')[0];
  const src = await toBase64(image);
  img.src = src;
  img.onload = () => {
    document.getElementById('submit').removeAttribute('disabled');
  };
}

function downloadURI(uri, name) {
  const link = document.createElement('a');
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

function renderAndDownloadGif(blob, filename, width) {
  const imgUrl = URL.createObjectURL(blob)
  const downloadButton = document.getElementById("download")
  outputElement.src = imgUrl
  outputElement.width = width
  canvasContainer.classList.add("hidden")
  downloadButton.onclick = function (event) {
    downloadURI(imgUrl, `-${filename}.png`)
  }
  clearCanvas()
  gif.freeWorkers.forEach((w) => w.terminate())
}