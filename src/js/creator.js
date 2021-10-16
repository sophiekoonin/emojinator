document.getElementById("form").onsubmit = function (event) {
  event.preventDefault()
  onUploadImage(event, img)
}
document.getElementById("form").onreset = reset
document.getElementById("creator-input").onchange = onImageSelect
document.getElementById("clear-canvas").onclick = clear
let konvaImages = []
const size = MAX_GIF_SIZE + MAX_GIF_SIZE / 2

function clear() {
  konvaImages = []
  baseLayer.destroyChildren()
  tr.nodes([])
  baseLayer.draw()
}

function reset(event) {
  event.target.reset()
  document.getElementById("submit").setAttribute("disabled", 1)
}

const stage = new Konva.Stage({
  container: "canvas",
  width: size,
  height: size,
})

function onItemClick(event) {
  const accessoryEl =
    event.target.nodeName === "BUTTON"
      ? event.target.lastChild.cloneNode()
      : event.target.cloneNode()

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
    name: `accessory-${accessoryEl.id}`,
    draggable: true,
    offsetX: accessoryEl.width / 2,
    offsetY: accessoryEl.height / 2,
  })
  konvaImages.push(accessory)
  baseLayer.add(accessory)
  const nodes = tr.nodes().concat([accessory])
  tr.nodes(nodes)
  baseLayer.batchDraw()
}

function onUploadImage(event, image) {
  const { width, height } = getScaledImageDimensions(
    image.width,
    image.height,
    MAX_GIF_SIZE
  )

  event.target.reset()

  const img = new Konva.Image({
    width,
    height,
    image,
    x: width / 4 + width / 2,
    y: height / 4 + height / 2,
    draggable: true,
    offsetX: width / 2,
    offsetY: height / 2,
  })

  konvaImages.push(img)
  baseLayer.add(img)
  tr.nodes(tr.nodes().concat([img]))
  baseLayer.draw()
}

init()
