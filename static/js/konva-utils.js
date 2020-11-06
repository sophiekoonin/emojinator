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
