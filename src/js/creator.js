document.getElementById("form").onsubmit = function (event) {
  event.preventDefault()
  event.target.reset()

  onUploadImage(img)
}
document.getElementById("form").onreset = resetForm
document.getElementById("creator-input").onchange = onImageSelect
document.getElementById("clear-canvas").onclick = startOver

function clearCanvas() {
  konvaImages = []
  baseLayer.destroyChildren()
  stage.width(SIZE)
  stage.height(SIZE)
  tr = generateTransformer()
  baseLayer.add(tr)
  stage.batchDraw()
}

function startOver() {
  clearCanvas()
  outputElement.src = ""
  outputElement.width = null
  showElement("canvas")
  hideElement("output")
  document.getElementById("embiggener-output").innerHTML = ""
  hideElement("embiggener-output")
}

function resetForm(event) {
  event.target.reset()
  document.getElementById("submit").setAttribute("disabled", 1)
}

function selectSkintone(selectedSkintone) {
  const prevSkintone = skintone
  document
    .getElementById(`skintone-label-${prevSkintone}`)
    .classList.remove("selected")

  skintone = selectedSkintone
  document
    .getElementById(`skintone-label-${selectedSkintone}`)
    .classList.add("selected")

  Array.from(document.getElementsByClassName("tintable")).forEach((el) => {
    const filename = el.src.split("-")[0].replace(".svg", "")

    el.src =
      filename +
      (SKINTONES[skintone] === SKINTONES.a
        ? ".svg"
        : `-${SKINTONES[skintone]}.svg`)
  })
}

function onItemClick(event) {
  const shape =
    event.target.nodeName === "BUTTON"
      ? event.target.firstElementChild.cloneNode(true)
      : event.target.cloneNode(true)

  const tagName = shape.tagName
  const type = shape.getAttribute("data-type") || "any"
  const qty = shape.getAttribute("data-qty") || 1

  let accessoryWidth
  if (type === "base") {
    accessoryWidth = SIZE * 0.75
  } else {
    accessoryWidth = Math.min(SIZE / 2, shape.width)
  }
  const accessoryHeight =
    accessoryWidth === shape.width
      ? shape.height
      : (accessoryWidth / shape.width) * shape.height

  shape.width = accessoryWidth
  shape.height = accessoryHeight
  debugger
  let accessory
  switch (shape.tagName) {
    case "svg":
      // accessory = new Konva.Path({
      //   // data: shape.getAttribute("d"),
      //   data: "m313.5 237.563c-5.47-38.445-30.54-55.625-57.5-55.625s-52.03 17.18-57.5 55.625c-6.905 0-12.5 8.955-12.5 20 0 10.535 5.105 19.075 11.57 19.85 6.115 33.245 29.925 52.65 58.43 52.65 28.5 0 52.315-19.405 58.425-52.65 6.47-.775 11.575-9.315 11.575-19.85 0-11.045-5.595-20-12.5-20z",
      //   fill: shape.getAttribute("fill"),
      //   // scaleX: 5,
      //   // scaleY: 5,
      //   draggable: true,
      // })
      // accessory.y(SIZE / 2)
      accessory = fabric.loadSVGFromString(shape.outerHTML)
      break
    case "circle":
      // accessory = new Konva.Circle({
      //   radius: SIZE / 4,
      //   x: 0,
      //   y: 0,
      //   offsetX: SIZE / 2,
      //   offsetY: SIZE / 2,
      //   fill: shape.getAttribute("fill"),
      //   draggable: true,
      // })
      break
    default:
      // accessory = new Konva.Image({
      //   draggable: true,
      //   image: accessoryEl,
      //   width: accessoryEl.width,
      //   height: accessoryEl.height,
      //   x: SIZE / 2,
      //   y: SIZE / 2,
      //   offsetX: SIZE / 2,
      //   offsetY: SIZE / 2,
      // })
      break
  }
  // accessory.on("dragmove", () =>
  //   console.log({
  //     baseX: accessory.x(),
  //     baseY: accessory.y(),
  //     ...accessory.getClientRect(),
  //   })
  // )

  const accessoryNodes = [accessory]
  canvas.add(accessory)
  // if (qty > 1) {
  //   const noflip = accessoryEl.getAttribute("data-noflip") || "false"
  //   accessory.x(accessoryEl.width / 2 + accessoryEl.width * 0.05)
  //   accessory.y(accessoryEl.height / 2 + accessoryEl.height * 0.05)
  //   const accessory2 = accessory.clone({
  //     name: `accessory-${accessoryEl.id}-${uuidv4()}`,
  //     x: accessoryEl.width / 2 + 75,
  //     scaleX: noflip !== "false" ? accessory.scaleX() : -accessory.scaleX(),
  //   })
  //   accessoryNodes.push(accessory2)
  // }

  konvaImages.push(...accessoryNodes)
  // tr.nodes(accessoryNodes)
  // tr.zIndex(konvaImages.length)
  // baseLayer.batchDraw()
}

function onUploadImage(image) {
  const { width, height } = getScaledImageDimensions(
    image.width,
    image.height,
    MAX_GIF_SIZE
  )

  const img = new Konva.Image({
    width,
    height,
    image: image.cloneNode(),
    x: width / 4 + width / 2,
    y: height / 4 + height / 2,
    draggable: true,
    offsetX: width / 2,
    offsetY: height / 2,
  })

  konvaImages.push(img)
  baseLayer.add(img)
  tr.nodes([img])
  tr.zIndex(konvaImages.length)

  baseLayer.draw()
}

function init() {
  // document.getElementById("move-up").onclick = () => {
  //   tr.nodes().forEach((node) => node.moveToTop())
  //   baseLayer.draw()
  // }
  // document.getElementById("move-down").onclick = () => {
  //   tr.nodes().forEach((node) => node.moveToBottom())
  //   baseLayer.draw()
  // }
  // document.getElementById("select-all").onclick = () => {
  //   tr.nodes(konvaImages)
  //   baseLayer.draw()
  // }

  // document.getElementById("rotate-left").onclick = () => {
  //   rotate(-90, tr, baseLayer)
  // }
  // document.getElementById("rotate-right").onclick = () => {
  //   rotate(90, tr, baseLayer)
  // }

  // document.getElementById("flip-horizontal").onclick = () => {
  //   tr.nodes().forEach((node) => node.scaleX(-node.scaleX()))
  //   baseLayer.batchDraw()
  // }
  // document.getElementById("flip-vertical").onclick = () => {
  //   tr.nodes().forEach((node) => node.scaleY(-node.scaleY()))
  // }

  // document.getElementById("align-middle").onclick = () => {
  //   tr.nodes().forEach((node) => node.y(stage.height() / 2))
  // }

  // document.getElementById("align-center").onclick = () => {
  //   tr.nodes().forEach((node) => {
  //     node.x(stage.width() / 2)
  //   })
  // }

  // document.getElementById("remove-node").onclick = destroySelectedNodes

  // stage.on("click tap", function (e) {
  //   clearSelection(e, stage, tr, baseLayer)
  // })

  // stage.on("mousedown touchstart", (event) => {
  //   drawSelectionRectangle(event, stage, baseLayer)
  // })
  // stage.on("mousemove touchmove", () => {
  //   expandSelectionRectangle(stage, baseLayer)
  // })
  // stage.on("mouseup touchend", () => {
  //   endSelectionRectangle(stage, tr, baseLayer)
  // })

  document.getElementById("download").addEventListener("click", (e) => {
    e.preventDefault()
    fitToScreen(() => {
      tr.nodes([])
      var dataURL = stage.toDataURL()
      downloadURI(dataURL, `emojinator-${filename}.png`)
    })
  })

  // Array.from(document.getElementsByClassName("skintone-picker-input")).forEach(
  //   (el) =>
  //     (el.onchange = (el) => {
  //       selectSkintone(el.target.value)
  //     })
  // )

  Array.from(document.getElementsByClassName("selector-option")).forEach(
    (el) => (el.onclick = onItemClick)
  )
  // stage.add(baseLayer)
  // baseLayer.add(tr)
  // baseLayer.add(selectionRectangle)
  // baseLayer.batchDraw()

  const debug = new URL(window.location.href).searchParams.get("debug")
  if (debug === "true") {
    img.src = "/images/debug.png"
    onUploadImage(img)
  }
}

// selectSkintone("a")
init()
