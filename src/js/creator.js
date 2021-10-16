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
  tr = generateTransformer()
  baseLayer.add(tr)
  baseLayer.batchDraw()
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
  tr.nodes(tr.nodes().concat(accessoryNodes))
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
