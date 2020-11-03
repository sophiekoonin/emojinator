function yeeify(image) {
  const { width, height } = image;
  document.getElementById('yee-actions').classList.remove('hidden');
  const hatImg = document.getElementById('cowboy-hat').cloneNode();
  hatImg.classList.remove('visually-hidden');
  const hatHeight = (width / hatImg.width) * hatImg.height;
  hatImg.width = width;
  hatImg.height = hatHeight;
  const stage = new Konva.Stage({
    container: 'yee-canvas',
    width: width + width / 2,
    height: height + height / 2,
  });

  let numHats = 0;
  const baseLayer = new Konva.Layer();
  stage.add(baseLayer);
  const baseImg = new Konva.Image({
    width,
    height,
    image,
    x: width / 4,
    y: height / 4,
    draggable: true,
  });

  baseLayer.add(baseImg);
  baseLayer.draw();

  const tr = new Konva.Transformer({
    nodes: [],
    keepRatio: true,
    boundBoxFunc: (oldBox, newBox) => {
      if (newBox.width < 10 || newBox.height < 10) {
        return oldBox;
      }
      return newBox;
    },
  });

  baseLayer.add(tr);

  addHat(numHats++);

  document.getElementById('add-hat').addEventListener('click', (e) => {
    addHat(numHats++);
  });

  document.getElementById('download').addEventListener('click', (e) => {
    tr.nodes([]);
    var dataURL = stage.toDataURL();
    downloadURI(dataURL, `yee${filename}.png`);
    false;
  });

  function addHat(numHats) {
    const hat = new Konva.Image({
      width: hatImg.width,
      image: hatImg,
      height: hatImg.height,
      x: 0,
      y: 0,
      name: `hat-${numHats}`,
      draggable: true,
    });
    baseLayer.add(hat);
    const nodes = tr.nodes().concat([hat]);
    tr.nodes(nodes);
    baseLayer.batchDraw();
  }

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
}

function yeeFormSubmit(event) {
  event.preventDefault();
  yeeify(img);
}

document.getElementById('yee-input').onchange = onImageSelect;
document.getElementById('yee-form').onsubmit = yeeFormSubmit;
