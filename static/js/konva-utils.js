var selectionRectangle = new Konva.Rect({
  id: 'selectionRectangle',
  visible: false,
  fill: 'rgba(165, 247, 239, 0.5)',
});

var x1, y1, x2, y2;
function drawSelectionRectangle(event, stage, layer) {
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

  layer.draw();
}

function expandSelectionRectangle(stage, layer) {
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
  layer.batchDraw();
}

function endSelectionRectangle(stage, tr, layer) {
  // no nothing if we didn't start selection
  if (!selectionRectangle.visible()) {
    return;
  }
  // update visibility in timeout, so we can check it in click event
  setTimeout(() => {
    selectionRectangle.visible(false);
    layer.batchDraw();
  });

  var shapes = stage.find('.img').toArray();
  var box = selectionRectangle.getClientRect();
  var selected = shapes.filter((shape) =>
    Konva.Util.haveIntersection(box, shape.getClientRect())
  );
  tr.nodes(selected);
}

function clearSelection(e, stage, tr, layer) {
  if (selectionRectangle.visible()) {
    return;
  }
  // if we click on empty area - remove all selections
  if (e.target === stage) {
    tr.nodes([]);
    layer.draw();
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

const fitToScreen = (stage, tr, layer) => {
  tr.remove();
  // get layers
  const layerSize = layer.getClientRect({
    relativeTo: stage,
  });
  layer.add(tr);

  const tween = new Konva.Tween({
    duration: 0.35,
    easing: Konva.Easings.EaseInOut,
    node: stage,
    onFinish: this.destroy,
    width: layerSize.width,
    height: layerSize.height,
  });

  // get the x and y coords of the transform layer with our images
  const { x, y } = tr.position();
  tween.play();
  tr.nodes().forEach((node) => {
    node.x(node.x() - x);
    node.y(node.y() - y);
  });
  stage.batchDraw();
};
