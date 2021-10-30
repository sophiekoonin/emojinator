/* GLOBALS AND CONSTANTS */

/* CONSTANTS */
const MAX_GIF_SIZE = 128
const SIZE = 200

/* ELEMENTS FOR GIF OUTPUT */
const gifCanvas = document.createElement("canvas")
const ctx = gifCanvas.getContext("2d")
const outputElement = document.getElementById("output")
const canvasContainer = document.getElementById("canvas")

/* COLOUR VARS */
let skintone = "a"
const SKINTONES = Object.freeze({
  a: {
    primary: "#FFDC5D",
    secondary: "#EF9645",
    tertiary: "#65471b",
  },
  b: {
    primary: "#F7DECE",
    secondary: "#E0AA94",
    tertiary: "#e18348",
  },
  c: {
    primary: "#F3D2A2",
    secondary: "#D2A077",
    tertiary: "#cf841b",
  },
  d: {
    primary: "#D5AB88",
    secondary: "#B78B60",
    tertiary: "#704f35",
  },
  e: {
    primary: "#AF7E57",
    secondary: "#90603E",
    tertiary: "#3a2910",
  },
  f: {
    primary: "#7C533E",
    secondary: "#583529",
    tertiary: "#201608",
  },
})

const selectedColours = {
  primary: null,
  secondary: null,
  tertiary: null,
}

// When we choose a new accessory/item, update the colours
function updateColourSelections() {
  Object.keys(selectedColours).forEach((c) => {
    if (selectedColours[c] != null) {
      document.getElementById(`${c}-color`).value = selectedColours[c]
      document.getElementById(`${c}-color`).removeAttribute("disabled")
    } else {
      document.getElementById(`${c}-color`).addAttribute("disabled")
    }
  })
}

function changeSelectedItemColour(e) {
  const input = e.target
  const { value, id } = input

  const changedColourType = id.replace("-color", "")
  selectedColours[changedColourType] = value

  canvas.getActiveObjects().forEach((obj) => {
    if (typeof obj.size !== "undefined") {
      // this is a group, so iterate
      obj.forEachObject((o) => {
        if (o.colorType === changedColourType) {
          o.set({ fill: value })
        }
      })
    } else {
      if (obj.cbjlorType === changedColourType) {
        obj.fill = value
      }
    }
  })
  canvas.renderAll()
}

/* RENDERING STUFF */

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
  const canChangeColor = itemEl.getAttribute("data-colorable") || "false"
  const isHuman = itemEl.getAttribute("data-ishuman") || "false"

  // Reset selected colours
  Object.keys(selectedColours).forEach((c) => (selectedColours[c] = null))

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
        objects.forEach((obj) => {
          obj.set({ isHuman: isHuman === "true" })
          if (obj.colorType) {
            selectedColours[obj.colorType] = obj.fill
          }
        })
        const obj = fabric.util
          .groupSVGElements(objects, options)
          .scaleToWidth(targetItemWidth)
        objectInstance = obj
        canvas.add(obj).centerObject(obj).renderAll()
        selectObjects([obj])
        updateColourSelections()
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

document.querySelector('input[type="color"]').oninput = changeSelectedItemColour
document.querySelector('input[type="color"]').onchange =
  changeSelectedItemColour
