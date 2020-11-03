function yeeify(image) {
  const { width, height } = image;
  const hatImg = document.getElementById('cowboy-hat');
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
  });

  baseLayer.add(baseImg);
  baseLayer.draw();
  addHat(numHats++);

  document.getElementById('add-hat').addEventListener('click', (e) => {
    addHat(numHats++);
  });
  function addHat(numHats) {
    // draw the hat on a new layer
    const hatLayer = new Konva.Layer();
    stage.add(hatLayer);

    const hat = new Konva.Image({
      width: hatImg.width,
      image: hatImg,
      height: hatImg.height,
      x: 0,
      y: 0,
      name: `hat-${numHats}`,
      draggable: true,
    });
    hatLayer.add(hat);

    const tr = new Konva.Transformer({
      nodes: [hat],
      keepRatio: true,
      boundBoxFunc: (oldBox, newBox) => {
        if (newBox.width < 10 || newBox.height < 10) {
          return oldBox;
        }
        return newBox;
      },
    });

    hatLayer.add(tr);
    hatLayer.batchDraw();
  }
}

function yeeFormSubmit(event) {
  event.preventDefault();
  yeeify(img);
}
