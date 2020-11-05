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

function superimpose(event) {
  event.preventDefault();
  event.target.reset();
  const konvaImages = [];
  const stage = new Konva.Stage({
    container: 'superimposer-canvas',
    width: MAX_SIZE,
    height: MAX_SIZE,
  });

  const baseLayer = new Konva.Layer();
  stage.add(baseLayer);

  Object.keys(images).forEach((i) => {
    const image = images[i];
    const { width, height } = getScaledImageDimensions(
      image.width,
      image.height,
      MAX_SIZE / 2
    );

    const konvaImg = new Konva.Image({
      width,
      height,
      image,
      x: MAX_SIZE / 2,
      y: MAX_SIZE / 2,
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

  stage.on('click tap', function (e) {
    // if we click on empty area - remove all selections
    if (e.target === stage) {
      tr.nodes([]);
      baseLayer.draw();
      return;
    }

    // do we pressed shift or ctrl?
    const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
    const isSelected = tr.nodes().indexOf(e.target) >= 0;

    if (!metaPressed && !isSelected) {
      // if no key pressed and the node is not selected
      // select just one
      tr.nodes([e.target]);
    } else if (metaPressed && isSelected) {
      // if we pressed keys and node was selected
      // we need to remove it from selection:
      const nodes = tr.nodes().slice(); // use slice to have new copy of array
      // remove node from array
      nodes.splice(nodes.indexOf(e.target), 1);
      tr.nodes(nodes);
    } else if (metaPressed && !isSelected) {
      // add the node into selection
      const nodes = tr.nodes().concat([e.target]);
      tr.nodes(nodes);
    }
  });

  document.getElementById('download').addEventListener('click', (e) => {
    tr.nodes([]);
    var dataURL = stage.toDataURL();
    downloadURI(dataURL, `yee${filename}.png`);
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
