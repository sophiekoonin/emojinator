document.getElementById("form").onsubmit = function (event) {
  event.preventDefault()
  event.target.reset()

  onUploadImage(img)
}
document.getElementById("form").onreset = resetForm
document.getElementById("creator-input").onchange = onImageSelect
document.getElementById("clear-canvas").onclick = startOver

let debugEl

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
  debugger
  const accessoryEl =
    event.target.nodeName === "BUTTON"
      ? event.target.firstElementChild.cloneNode()
      : event.target.cloneNode()

  const tagName = accessoryEl.tagName
  const type = accessoryEl.getAttribute("data-type") || "any"
  const qty = accessoryEl.getAttribute("data-qty") || 1

  let accessoryWidth
  if (type === "base") {
    accessoryWidth = SIZE * 0.75
  } else {
    accessoryWidth = Math.min(SIZE / 2, accessoryEl.width)
  }
  const accessoryHeight =
    accessoryWidth === accessoryEl.width
      ? accessoryEl.height
      : (accessoryWidth / accessoryEl.width) * accessoryEl.height

  accessoryEl.width = accessoryWidth
  accessoryEl.height = accessoryHeight

  let accessory
  if (tagName === "svg") {
    debugEl = accessoryEl
    debugger
  } else {
    accessory = new Konva.Image({
      image: accessoryEl,
      width: accessoryEl.width,
      height: accessoryEl.height,
      x: SIZE / 2,
      y: SIZE / 2,
      draggable: true,
      offsetX: accessoryEl.width / 2,
      offsetY: accessoryEl.height / 2,
    })
  }
  const accessoryNodes = [accessory]
  baseLayer.add(accessory)

  if (qty > 1) {
    const noflip = accessoryEl.getAttribute("data-noflip") || "false"
    accessory.x(accessoryEl.width / 2 + accessoryEl.width * 0.05)
    accessory.y(accessoryEl.height / 2 + accessoryEl.height * 0.05)
    const accessory2 = accessory.clone({
      name: `accessory-${accessoryEl.id}-${uuidv4()}`,
      x: accessoryEl.width / 2 + 75,
      scaleX: noflip !== "false" ? accessory.scaleX() : -accessory.scaleX(),
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
  }

  document.getElementById("align-middle").onclick = () => {
    tr.nodes().forEach((node) => node.y(stage.height() / 2))
  }

  document.getElementById("align-center").onclick = () => {
    tr.nodes().forEach((node) => {
      node.x(stage.width() / 2)
    })
  }

  document.getElementById("remove-node").onclick = destroySelectedNodes

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

  Array.from(document.getElementsByClassName("skintone-picker-input")).forEach(
    (el) =>
      (el.onchange = (el) => {
        selectSkintone(el.target.value)
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

selectSkintone("a")
init()
