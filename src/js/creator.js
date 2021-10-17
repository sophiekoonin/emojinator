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
  tr = generateTransformer()
  baseLayer.add(tr)
  baseLayer.batchDraw()
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

function selectTint(selectedTint) {
  const prevTint = tint
  document.getElementById(`tint-label-${prevTint}`).classList.remove("selected")

  tint = selectedTint
  document
    .getElementById(`tint-label-${selectedTint}`)
    .classList.add("selected")

  Array.from(document.getElementsByClassName("tintable")).forEach((el) => {
    const filename = el.src.split("-")[0].replace(".svg", "")

    el.src =
      filename + (TINTS[tint] === TINTS.a ? ".svg" : `-${TINTS[tint]}.svg`)
  })
}

function onItemClick(event) {
  const accessoryEl =
    event.target.nodeName === "BUTTON"
      ? event.target.lastChild.cloneNode()
      : event.target.cloneNode()

  const qty = accessoryEl.getAttribute("data-qty")
  const accessoryWidth = Math.min(size / 2, accessoryEl.width)
  const accessoryHeight =
    accessoryWidth === accessoryEl.width
      ? accessoryEl.height
      : (accessoryWidth / accessoryEl.width) * accessoryEl.height

  accessoryEl.width = accessoryWidth
  accessoryEl.height = accessoryHeight

  const accessory = new Konva.Image({
    image: accessoryEl,
    width: accessoryEl.width,
    height: accessoryEl.height,
    x: accessoryEl.width / 2,
    y: accessoryEl.height / 2,
    draggable: true,
    offsetX: accessoryEl.width / 2,
    offsetY: accessoryEl.height / 2,
  })
  const accessoryNodes = [accessory]
  baseLayer.add(accessory)

  if (qty > 1) {
    const accessory2 = accessory.clone({
      name: `accessory-${accessoryEl.id}-${uuidv4()}`,
      x: accessoryEl.width / 2 + 75,
      scaleX: -accessory.scaleX(),
    })
    accessoryNodes.push(accessory2)
    baseLayer.add(accessory2)
  }

  konvaImages.push(...accessoryNodes)
  tr.nodes(accessoryNodes)
  tr.zIndex(konvaImages.length)
  baseLayer.batchDraw()
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
  document.getElementById("move-up").onclick = () => {
    tr.nodes().forEach((node) => node.moveToTop())
    baseLayer.draw()
  }
  document.getElementById("move-down").onclick = () => {
    tr.nodes().forEach((node) => node.moveToBottom())
    baseLayer.draw()
  }
  document.getElementById("select-all").onclick = () => {
    tr.nodes(konvaImages)
    baseLayer.draw()
  }

  document.getElementById("rotate-left").onclick = () => {
    rotate(-90, tr, baseLayer)
  }
  document.getElementById("rotate-right").onclick = () => {
    rotate(90, tr, baseLayer)
  }

  document.getElementById("flip-horizontal").onclick = () => {
    tr.nodes().forEach((node) => node.scaleX(-node.scaleX()))
    baseLayer.batchDraw()
  }
  document.getElementById("flip-vertical").onclick = () => {
    tr.nodes().forEach((node) => node.scaleY(-node.scaleY()))
    baseLayer.batchDraw()
  }

  document.getElementById("remove-node").onclick = () => {
    tr.nodes().forEach((node) => node.destroy())
    tr.nodes([])
    baseLayer.batchDraw()
  }

  stage.on("click tap", function (e) {
    clearSelection(e, stage, tr, baseLayer)
  })

  stage.on("mousedown touchstart", (event) => {
    drawSelectionRectangle(event, stage, baseLayer)
  })
  stage.on("mousemove touchmove", () => {
    expandSelectionRectangle(stage, baseLayer)
  })
  stage.on("mouseup touchend", () => {
    endSelectionRectangle(stage, tr, baseLayer)
  })

  document.getElementById("download").addEventListener("click", (e) => {
    e.preventDefault()
    fitToScreen(() => {
      tr.nodes([])
      var dataURL = stage.toDataURL()
      downloadURI(dataURL, `emojinator-${filename}.png`)
    })
  })

  Array.from(document.getElementsByClassName("tint-picker-input")).forEach(
    (el) =>
      (el.onchange = (el) => {
        selectTint(el.target.value)
      })
  )

  Array.from(document.getElementsByClassName("selector-option")).forEach(
    (el) => (el.onclick = onItemClick)
  )
  stage.add(baseLayer)

  baseLayer.add(tr)
  baseLayer.add(selectionRectangle)

  baseLayer.batchDraw()

  const debug = new URL(window.location.href).searchParams.get("debug")
  if (debug === "true") {
    img.src = "/images/debug.png"
    onUploadImage(img)
  }
}

selectTint("a")
init()
