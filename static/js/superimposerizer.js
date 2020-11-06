document.getElementById('superimposer-form').onsubmit = superimpose;
document.getElementById('superimposer-form').onreset = reset;

let numImages = 2;
let loadedImages = 0;
const images = {
  img1: new Image(),
  img2: new Image(),
};

function reset(event) {
  event.target.reset();
  document.getElementById('more-imgs-wrapper').classList.add('hidden');
  document.getElementById('more-imgs').classList.remove('hidden');
  document.getElementById('submit').setAttribute('disabled', 1);
}

function onAddMore() {
  document.getElementById('more-imgs-wrapper').classList.remove('hidden');
  document.getElementById('more-imgs').classList.add('hidden');
  document.getElementById('submit').setAttribute('disabled', 1);
}

async function onImageLoad(event) {
  const image = event.target.files[0];
  images[event.target.id].src = await toBase64(image);
  images[event.target.id].onload = () => {
    loadedImages++;
    if (loadedImages === numImages) {
      //finished!
      document.getElementById('submit').removeAttribute('disabled');
    }
  };
}
async function onImagesLoad(event) {
  const numFiles = event.target.files.length;
  for (let i = 0; i < numFiles; i++) {
    const file = event.target.files.item(i);
    numImages++;
    const image = new Image();
    image.src = await toBase64(file);
    image.onload = () => {
      images[`img${numImages}`] = image;
      loadedImages++;
      if (loadedImages === numImages) {
        //finished!
        document.getElementById('submit').removeAttribute('disabled');
      }
    };
  }
}

// TODO
// function superimpose(event) {
//   event.preventDefault();
//   event.target.reset();
function superimpose() {
  const img1 = document.getElementById('robot-img');
  const img2 = document.getElementById('bin-img');
  // TODO
  const konvaImages = [];
  const stage = new Konva.Stage({
    container: 'superimposer-canvas',
    width: MAX_GIF_SIZE + MAX_GIF_SIZE / 2,
    height: MAX_GIF_SIZE + MAX_GIF_SIZE / 2,
  });

  const baseLayer = new Konva.Layer();
  stage.add(baseLayer);

  [img1, img2].forEach((i) => {
    const image = i;
    console.log({ image });
    const { width, height } = getScaledImageDimensions(
      image.width,
      image.height,
      MAX_GIF_SIZE / 2
    );

    const konvaImg = new Konva.Image({
      width,
      height,
      name: 'img',
      image,
      x: MAX_GIF_SIZE / 4,
      y: MAX_GIF_SIZE / 4,
      draggable: true,
    });

    konvaImages.push(konvaImg);

    baseLayer.add(konvaImg);
  });

  const tr = new Konva.Transformer({
    nodes: konvaImages,
    keepRatio: true,
    boundBoxFunc: (oldBox, newBox) => {
      if (newBox.width < 10 || newBox.height < 10) {
        return oldBox;
      }
      return newBox;
    },
  });

  baseLayer.add(tr);
  baseLayer.batchDraw();

  baseLayer.add(selectionRectangle);

  stage.on('click tap', function (e) {
    clearSelection(e, stage, tr, baseLayer);
  });

  stage.on('mousedown touchstart', (event) => {
    drawSelectionRectangle(event, stage, baseLayer);
  });
  stage.on('mousemove touchmove', () => {
    expandSelectionRectangle(stage, baseLayer);
  });
  stage.on('mouseup touchend', () => {
    endSelectionRectangle(stage, tr, baseLayer);
  });

  document.getElementById('download').addEventListener('click', (e) => {
    tr.nodes([]);
    var dataURL = stage.toDataURL();
    downloadURI(dataURL, `superimposerizer.png`);
    false;
  });
  document.getElementById('move-up').onclick = () => {
    tr.nodes().forEach((node) => node.moveToTop());
    baseLayer.draw();
  };
  document.getElementById('move-down').onclick = () => {
    tr.nodes().forEach((node) => node.moveToBottom());
    baseLayer.draw();
  };
  document.getElementById('actions').classList.remove('hidden');
}

document.getElementById('more-imgs').onclick = onAddMore;
document.getElementById('img1').onchange = onImageLoad;
document.getElementById('img2').onchange = onImageLoad;
document.getElementById('imgs').onchange = onImagesLoad;
superimpose();
