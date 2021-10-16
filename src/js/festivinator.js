document.getElementById('form').onsubmit = function (event) {
  event.preventDefault();
  festivinate(event, img);
};
document.getElementById('form').onreset = reset;
document.getElementById('festive-input').onchange = onImageSelect;

let konvaImages = [];

function reset(event) {
  event.target.reset();
  konvaImages = [];
  document.getElementById('actions').classList.add('hidden');
  document.getElementById('add-hat').classList.add('hidden');
  document.getElementById('submit').setAttribute('disabled', 1);
}

const stage = new Konva.Stage({
  container: 'canvas',
  width: MAX_GIF_SIZE + MAX_GIF_SIZE / 2,
  height: MAX_GIF_SIZE + MAX_GIF_SIZE / 2,
});

// TODO
function festivinate(event, image) {
  const { width, height } = getScaledImageDimensions(
    image.width,
    image.height,
    MAX_GIF_SIZE
  );

  stage.width(width + width / 2);
  stage.height(height + height / 2);
  init();
  event.target.reset();

  const hatImg = document.getElementById('santa-hat').cloneNode();
  hatImg.classList.remove('visually-hidden');
  const hatHeight = (width / hatImg.width) * hatImg.height;
  hatImg.width = width;
  hatImg.height = hatHeight;

  let numHats = 0;

  stage.add(baseLayer);
  const baseImg = new Konva.Image({
    width,
    height,
    image,
    x: width / 4 + width / 2,
    y: height / 4 + height / 2,
    draggable: true,
    offsetX: width / 2,
    offsetY: height / 2,
  });

  konvaImages.push(baseImg);
  baseLayer.add(baseImg);
  baseLayer.draw();

  baseLayer.add(tr);

  addHat(numHats++);
  baseLayer.add(selectionRectangle);

  document.getElementById('add-hat').addEventListener('click', (e) => {
    addHat(numHats++);
  });

  document.getElementById('download').addEventListener('click', (e) => {
    e.preventDefault();
    fitToScreen(() => {
      tr.nodes([]);
      var dataURL = stage.toDataURL();
      downloadURI(dataURL, `festive${filename}.png`);
    });
  });

  function addHat(numHats) {
    const hat = new Konva.Image({
      width: hatImg.width,
      image: hatImg,
      height: hatImg.height,
      x: hatImg.width / 2,
      y: hatImg.height / 2,
      name: `hat-${numHats}`,
      draggable: true,
      offsetX: hatImg.width / 2,
      offsetY: hatImg.height / 2,
    });
    konvaImages.push(hat);
    baseLayer.add(hat);
    const nodes = tr.nodes().concat([hat]);
    tr.nodes(nodes);
    baseLayer.batchDraw();
  }

  document.getElementById('actions').classList.remove('hidden');
  document.getElementById('add-hat').classList.remove('hidden');
}
