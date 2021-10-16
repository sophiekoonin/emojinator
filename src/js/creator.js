document.getElementById("form").onsubmit = function (event) {
  event.preventDefault()
  create(event, img)
}
document.getElementById("form").onreset = reset
document.getElementById("creator-input").onchange = onImageSelect

let konvaImages = []
let width = 0

function reset(event) {
  event.target.reset()
  konvaImages = []
  document.getElementById("actions").classList.add("hidden")
  document.getElementById("submit").setAttribute("disabled", 1)
}

const stage = new Konva.Stage({
  container: "canvas",
  width: MAX_GIF_SIZE + MAX_GIF_SIZE / 2,
  height: MAX_GIF_SIZE + MAX_GIF_SIZE / 2,
})

function onItemClick(event) {
  const accessoryNode = event.target.cloneNode()
  const accessoryHeight = (width / accessoryNode.width) * accessoryNode.height

  accessoryNode.width = width
  accessoryNode.height = accessoryHeight
  const accessory = new Konva.Image({
    width: accessoryNode.width,
    image: accessoryNode,
    height: accessoryNode.height,
    x: accessoryNode.width / 2,
    y: accessoryNode.height / 2,
    name: `accessory-${accessoryNode.id}`,
    draggable: true,
    offsetX: accessoryNode.width / 2,
    offsetY: accessoryNode.height / 2,
  })
  konvaImages.push(accessory)
  baseLayer.add(accessory)
  const nodes = tr.nodes().concat([accessory])
  tr.nodes(nodes)
  baseLayer.batchDraw()
}

function create(event, image) {
  const { width: _width, height } = getScaledImageDimensions(
    image.width,
    image.height,
    MAX_GIF_SIZE
  )

  width = _width

  stage.width(width + width / 2)
  stage.height(height + height / 2)
  init()
  event.target.reset()

  stage.add(baseLayer)
  const baseImg = new Konva.Image({
    width,
    height,
    image,
    x: width / 4 + width / 2,
    y: height / 4 + height / 2,
    draggable: true,
    offsetX: width / 2,
    offsetY: height / 2,
  })

  konvaImages.push(baseImg)
  baseLayer.add(baseImg)
  baseLayer.draw()

  baseLayer.add(tr)

  baseLayer.add(selectionRectangle)

  document.getElementById("download").addEventListener("click", (e) => {
    e.preventDefault()
    fitToScreen(() => {
      tr.nodes([])
      var dataURL = stage.toDataURL()
      downloadURI(dataURL, `emojinator-${filename}.png`)
    })
  })
  Array.from(document.getElementsByClassName("selector-option")).forEach(
    (el) => (el.onclick = onItemClick)
  )
  document.getElementById("actions").classList.remove("hidden")
}
