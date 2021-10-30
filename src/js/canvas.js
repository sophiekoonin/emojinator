/* GLOBALS AND CONSTANTS */

/* CONSTANTS */
const MAX_GIF_SIZE = 128
const SIZE = 200

/* ELEMENTS FOR GIF OUTPUT */
const gifCanvas = document.createElement("canvas")
const ctx = gifCanvas.getContext("2d")
const outputElement = document.getElementById("output")
const canvasContainer = document.getElementById("canvas")

// The main emojinator canvas
const canvas = new fabric.Canvas("c", {
  width: SIZE,
  height: SIZE,
})

/* Functions for rendering stuff to canvas */
function onItemClick(event) {
  const itemEl =
    event.target.tagName === "BUTTON"
      ? event.target.firstElementChild
      : event.path
          .find((el) => {
            console.log(el)
            return ["img", "svg"].includes(el.tagName.toLowerCase())
          })
          .cloneNode(true)
  const tagName = itemEl.tagName
  const type = itemEl.getAttribute("data-type") || "any"
  const qty = itemEl.getAttribute("data-qty") || 1

  // SVG width/height properties are not the same as image width/height properties
  // so if these properties don't return a number, get it off the SVG itself.
  const itemWidth =
    typeof itemEl.width === "number"
      ? itemEl.width
      : Number(itemEl.getAttribute("width") || 0)
  const itemHeight =
    typeof itemEl.height === "number"
      ? itemEl.height
      : Number(itemEl.getAttribute("height") || 0)

  let targetItemWidth
  if (type === "base") {
    targetItemWidth = SIZE * 0.75
  } else {
    targetItemWidth = Math.min(SIZE / 2, itemWidth)
  }

  const scaleFactor = targetItemWidth / itemWidth

  let objectInstance

  switch (itemEl.tagName) {
    case "svg":
      fabric.loadSVGFromString(itemEl.outerHTML, (objects, options) => {
        const obj = fabric.util
          .groupSVGElements(objects, options)
          .scaleToWidth(targetItemWidth)
        objectInstance = obj
        canvas.add(obj).centerObject(obj).renderAll()
        selectObjects([obj])
      })
      break
    default:
      // Render as image
      objectInstance = new fabric.Image(itemEl, {
        centeredRotation: true,
        centeredScaling: true,
        left: SIZE / 2,
        top: SIZE / 2,
        originY: "center",
        originX: "center",
        active: true,
      })
      objectInstance.scale(scaleFactor)
      selectObjects([objectInstance])
      canvas.add(objectInstance).renderAll()
      break
  }

  if (qty > 1) {
    canvas.discardActiveObject()
    const noflip = itemEl.getAttribute("data-noflip") || "false"
    objectInstance
      .scaleToWidth(50)
      .set({ left: itemWidth / 2 + itemWidth * 0.05, top: SIZE / 2 })
    const item2 = objectInstance.clone((obj) => {
      obj.set({
        active: true,
        left: itemWidth / 2 + 75,
        top: SIZE / 2,
        flipX: noflip !== "true",
      })
      canvas.add(obj).renderAll()
      selectObjects([objectInstance, obj])
    })
  }
}

/* Uploading an image */

function onUploadImage(image) {
  const { width, height } = getScaledImageDimensions(
    image.width,
    image.height,
    MAX_GIF_SIZE
  )

  // do stuff with image
}

function forEachActiveObject(callback) {
  canvas.getActiveObjects().forEach(callback)
  canvas.renderAll()
}

function selectObjects(objs) {
  canvas.discardActiveObject()
  canvas.setActiveObject(
    new fabric.ActiveSelection(objs, {
      canvas,
    })
  )
  canvas.requestRenderAll()
}

/* TOOLBAR BUTTONS */
function initToolbar() {
  document.getElementById("move-up").onclick = () => {
    forEachActiveObject(canvas.bringForward)
  }
  document.getElementById("move-down").onclick = () => {
    forEachActiveObject(canvas.sendBackwards)
  }
  document.getElementById("select-all").onclick = () => {
    selectObjects(canvas.getObjects())
  }

  document.getElementById("rotate-left").onclick = () => {
    forEachActiveObject((obj) => obj.rotate(obj.angle - 45))
  }
  document.getElementById("rotate-right").onclick = () => {
    forEachActiveObject((obj) => obj.rotate(obj.angle + 45))
  }

  document.getElementById("flip-horizontal").onclick = () => {
    forEachActiveObject((obj) => obj.toggle("flipX"))
  }
  document.getElementById("flip-vertical").onclick = () => {
    forEachActiveObject((obj) => obj.toggle("flipY"))
  }

  document.getElementById("align-middle").onclick = () => {
    forEachActiveObject((obj) => canvas.centerObjectV(obj))
  }

  document.getElementById("align-center").onclick = () => {
    forEachActiveObject((obj) => canvas.centerObjectH(obj))
  }

  document.getElementById("remove-node").onclick = () => {
    forEachActiveObject((obj) => canvas.remove(obj))
    canvas.discardActiveObject()
    canvas.renderAll()
  }
}
initToolbar()
