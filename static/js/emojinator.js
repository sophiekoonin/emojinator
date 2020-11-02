const MAX_CANVAS_SIZE = 64;

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
img = new Image();

function scaleDimensions(longerSide, shorterSide) {
  const longScaled =
    longerSide > MAX_CANVAS_SIZE ? MAX_CANVAS_SIZE : longerSide;
  const shortScaled = (longScaled / longerSide) * shorterSide;
  return [longScaled, shortScaled];
}

function getScaledImageDimensions(width, height) {
  if (width === 0 || height === 0)
    throw new Error('Width or height cannot be zero!');
  const imageAspectRatio = width / height;
  // width < height
  if (imageAspectRatio < 1) {
    const [newHeight, newWidth] = scaleDimensions(height, width);

    return {
      width: newWidth,
      height: newHeight,
    };
  }

  // width > height
  if (imageAspectRatio > 1) {
    const [newWidth, newHeight] = scaleDimensions(width, height);

    return {
      width: newWidth,
      height: newHeight,
    };
  }

  // width = height
  const newSize = width > MAX_CANVAS_SIZE ? MAX_CANVAS_SIZE : width;
  return {
    width: newSize,
    height: newSize,
  };
}

async function onImageSelect(event) {
  const image = event.target.files[0];
  const src = await toBase64(image);
  img.src = src;
  img.onload = () => {
    document.getElementById('submit').removeAttribute('disabled');
  };
}
