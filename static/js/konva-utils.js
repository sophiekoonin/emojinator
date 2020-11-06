const selectionRectangle = new Konva.Rect({
  id: 'selectionRectangle',
  visible: false,
  fill: 'rgba(165, 247, 239, 0.5)',
});

const baseLayer = new Konva.Layer();

const tr = new Konva.Transformer({
  rotationSnaps: [0, 90, 180, 270],
  keepRatio: true,
  boundBoxFunc: (oldBox, newBox) => {
    if (newBox.width < 10 || newBox.height < 10) {
      return oldBox;
    }
    return newBox;
  },
  nodes: [],
});
let x1, y1, x2, y2;
function drawSelectionRectangle(event) {
  // do nothing if we mousedown on eny shape
  if (event.target !== stage) {
    return;
  }
  x1 = stage.getPointerPosition().x;
  y1 = stage.getPointerPosition().y;
  x2 = stage.getPointerPosition().x;
  y2 = stage.getPointerPosition().y;

  selectionRectangle.visible(true);
  selectionRectangle.width(0);
  selectionRectangle.height(0);

  baseLayer.draw();
}

function expandSelectionRectangle() {
  // no nothing if we didn't start selection
  if (selectionRectangle.visible() === false) {
    return;
  }
  x2 = stage.getPointerPosition().x;
  y2 = stage.getPointerPosition().y;

  selectionRectangle.setAttrs({
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
  });
  baseLayer.batchDraw();
}

function endSelectionRectangle() {
  // no nothing if we didn't start selection
  if (!selectionRectangle.visible()) {
    return;
  }
  // update visibility in timeout, so we can check it in click event
  setTimeout(() => {
    selectionRectangle.visible(false);
    baseLayer.batchDraw();
  });

  var shapes = stage.find('.img').toArray();
  var box = selectionRectangle.getClientRect();
  var selected = shapes.filter((shape) =>
    Konva.Util.haveIntersection(box, shape.getClientRect())
  );
  tr.nodes(selected);
}

function clearSelection(e) {
  if (selectionRectangle.visible()) {
    return;
  }
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
}

const fitToScreen = () => {
  tr.remove();
  // get layers
  const layerSize = baseLayer.getClientRect({
    relativeTo: stage,
  });
  baseLayer.add(tr);

  const tween = new Konva.Tween({
    duration: 0.35,
    easing: Konva.Easings.EaseInOut,
    node: stage,
    onFinish: this.destroy,
    width: layerSize.width,
    height: layerSize.height,
  });

  // get the x and y coords of the transform baseLayer with our images
  const { x, y } = tr.position();
  tween.play();
  tr.nodes().forEach((node) => {
    node.x(node.x() - x);
    node.y(node.y() - y);
  });
  stage.batchDraw();
};

function rotate(deg) {
  tr.nodes().forEach((node) => node.rotate(deg));
  baseLayer.batchDraw();
}

function init() {
  document.getElementById('move-up').onclick = () => {
    tr.nodes().forEach((node) => node.moveToTop());
    baseLayer.draw();
  };
  document.getElementById('move-down').onclick = () => {
    tr.nodes().forEach((node) => node.moveToBottom());
    baseLayer.draw();
  };
  document.getElementById('shrink').onclick = () => {
    fitToScreen(stage, tr, baseLayer);
  };
  document.getElementById('select-all').onclick = () => {
    tr.nodes(konvaImages);
    baseLayer.draw();
  };

  document.getElementById('rotate-left').onclick = () => {
    rotate(-90, tr, baseLayer);
  };
  document.getElementById('rotate-right').onclick = () => {
    rotate(90, tr, baseLayer);
  };

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
}
