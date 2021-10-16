const stage = new Konva.Stage({
  container: 'canvas',
});

const TextEyes = {
  hearts: '❤️',
  stars: '⭐️',
  fire: '🔥',
};

const SingleAccessories = ['halo'];
let konvaImages = [];

function reset(event) {
  event.target.reset();
  baseLayer.destroyChildren();
  konvaImages = [];

  document.getElementById('actions').classList.add('hidden');
  document.getElementById('submit').setAttribute('disabled', 1);
}

function accessorize(event, image, option) {
  const { width, height } = getScaledImageDimensions(
    image.width,
    image.height,
    MAX_GIF_SIZE
  );

  stage.width(width + width / 2);
  stage.height(height + height / 2);
  init();
  event.target.reset();

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
  const isTextOption = TextEyes[option] != null;
  let eye1, eye2;
  if (isTextOption) {
    eye1 = new Konva.Text({
      x: width / 4,
      y: width / 5,
      text: TextEyes[option],
      fontSize: 20,
      draggable: true,
    });
    eye2 = new Konva.Text({
      x: width / 4 + 50,
      y: width / 5,
      text: TextEyes[option],
      fontSize: 20,
      draggable: true,
    });
  } else {
    const eyeImg = document.getElementById(`img-${option}`).cloneNode();
    eyeImg.classList.remove('visually-hidden');
    eye1 = new Konva.Image({
      x: width / 4,
      y: width / 5,
      draggable: true,
      image: eyeImg,
    });
    eye2 = new Konva.Image({
      x: width / 4 + 75,
      y: width / 5,
      draggable: true,
      image: eyeImg,
      scaleX: -eye1.scaleX(),
    });
  }
  const eyeNodes = [eye1];
  baseLayer.add(eye1);
  if (!SingleAccessories.includes(option)) {
    baseLayer.add(eye2);
    eyeNodes.push(eye2);
  }

  konvaImages.push(...eyeNodes);
  baseLayer.draw();
  baseLayer.add(tr);
  tr.nodes(eyeNodes);

  baseLayer.add(selectionRectangle);

  document.getElementById('download').addEventListener('click', (e) => {
    e.preventDefault();
    fitToScreen(() => {
      tr.nodes([]);
      var dataURL = stage.toDataURL();
      downloadURI(dataURL, `${filename}-${option}.png`);
    });
  });

  document.getElementById('actions').classList.remove('hidden');
}

function eyeFormSubmit(event) {
  event.preventDefault();
  const option = event.target[1].value;
  accessorize(event, img, option);
}

document.getElementById('eye-input').onchange = onImageSelect;
document.getElementById('form').onsubmit = eyeFormSubmit;
document.getElementById('form').onreset = reset;
