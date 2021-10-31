/* GLOBALS AND CONSTANTS */

/* CONSTANTS */
const MAX_GIF_SIZE = 128
const SIZE = 200
let filename = "image"
/* ELEMENTS FOR GIF OUTPUT */
const gifCanvas = document.createElement("canvas")
const ctx = gifCanvas.getContext("2d")
const outputElement = document.getElementById("output")
const canvasContainer = document.getElementById("c")

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
      document.getElementById(
        `${c}-preview`
      ).style = `background-color: ${selectedColours[c]};`
      showElement(`${c}-color-label`)
    } else {
      hideElement(`${c}-color-label`)
    }
  })
}

function resetColours() {
  Object.keys(selectedColours).forEach((c) => (selectedColours[c] = null))
}
function loadColourFromObject(obj) {
  if (typeof obj.size !== "undefined") {
    obj.forEachObject((o) => {
      if (o.colorType) {
        selectedColours[o.colorType] = o.fill
      }
    })
  }
  if (obj.colorType) {
    selectedColours[obj.colorType] = obj.fill
  }
}

function hideColours() {
  resetColours()
  hideElement("primary-color-label")
  hideElement("secondary-color-label")
  hideElement("tertiary-color-label")
}

function changeSelectedSkintone(e) {
  skintone = e.target.value
  canvas.getActiveObjects().forEach((obj) => {
    if (typeof obj.size !== "undefined") {
      // this is a group, so iterate
      obj.forEachObject((o) => {
        if (o.isSkin) {
          o.set({ fill: SKINTONES[value][o.colorType] })
        }
      })
    } else {
      if (obj.isSkin) {
        obj.set({ fill: SKINTONES[value][o.colorType] })
      }
    }
  })
  canvas.renderAll()
  Array.from(document.querySelectorAll('svg *[data-isskin="true"]')).forEach(
    (el) => {
      const colorType = el.getAttribute("data-colortype")
      if (colorType != null) {
        el.setAttribute("fill", SKINTONES[skintone][colorType])
      }
    }
  )
}

function changeSelectedItemColour(e) {
  const input = e.target
  const { value, id } = input

  const changedColourType = id.replace("-color", "")
  selectedColours[changedColourType] = value
  document.getElementById(
    `${changedColourType}-preview`
  ).style = `background-color: ${value};`
  canvas.getActiveObjects().forEach((obj) => {
    if (typeof obj.size !== "undefined") {
      // this is a group, so iterate
      obj.forEachObject((o) => {
        if (o.colorType === changedColourType) {
          o.set({ fill: value })
        }
      })
    } else {
      if (obj.colorType === changedColourType) {
        obj.set({ fill: value })
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
      : event
          .composedPath()
          .find((el) => {
            return ["img", "svg"].includes(el.tagName.toLowerCase())
          })
          .cloneNode(true)

  const tagName = itemEl.tagName
  const type = itemEl.getAttribute("data-type") || "any"
  const qty = itemEl.getAttribute("data-qty") || 1
  const canChangeColor = itemEl.getAttribute("data-colorable") || "false"

  resetColours()

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
    targetItemWidth = SIZE * 0.8
  } else {
    targetItemWidth = Math.min(SIZE / 2, itemWidth)
  }

  const scaleFactor = targetItemWidth / itemWidth

  let objectInstance

  switch (itemEl.tagName) {
    case "svg":
      fabric.loadSVGFromString(itemEl.outerHTML, (objects, options) => {
        objects.forEach((obj) => {
          loadColourFromObject(obj)
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
      })
      objectInstance.scale(scaleFactor)
      canvas.add(objectInstance).renderAll()
      selectObjects([objectInstance])
      hideColours()
      break
  }

  if (qty > 1) {
    canvas.discardActiveObject()
    const noflip = itemEl.getAttribute("data-noflip") || "false"
    const targetWidth = objectInstance.height > objectInstance.width ? 25 : 40
    objectInstance
      .scaleToWidth(targetWidth)
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
  const imgEl = new fabric.Image(image, {
    centeredRotation: true,
    centeredScaling: true,
    left: SIZE / 2,
    top: SIZE / 2,
    originY: "center",
    originX: "center",
  }).scaleToWidth(width)
  hideColours()
  canvas.add(imgEl).renderAll()
  selectObjects([imgEl])
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
    forEachActiveObject((obj) => canvas.bringForward(obj))
  }
  document.getElementById("move-down").onclick = () => {
    forEachActiveObject((obj) => canvas.sendBackwards(obj))
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

Array.from(document.getElementsByClassName("selector-option")).forEach(
  (el) => (el.onclick = onItemClick)
)

Array.from(document.getElementsByClassName("colour-picker-input")).forEach(
  (el) => (el.oninput = changeSelectedItemColour)
)
Array.from(document.getElementsByClassName("colour-picker-input")).forEach(
  (el) => (el.onchange = changeSelectedItemColour)
)
Array.from(document.getElementsByClassName("skintone-picker-input")).forEach(
  (el) => (el.onchange = changeSelectedSkintone)
)

function scaleCanvas(callback) {
  canvas.discardActiveObject()
  const group = new fabric.Group()
  const canvasObjects = canvas.getObjects()
  canvasObjects.forEach((obj) => {
    obj.clone((c) => {
      group.addWithUpdate(c)
      // thx i hate it
      // clone is async, but only takes an individual callback
      if (group.size() === canvasObjects.length) {
        group.set({ top: 0, left: 0 })
        canvas.clear().renderAll()
        canvas.setHeight(group.height)
        canvas.setWidth(group.width)
        canvas.add(group).renderAll()
        callback()
      }
    })
  })
}

document.getElementById("download").onclick = (e) => {
  scaleCanvas(() => {
    var dataURL = canvas.toDataURL()
    downloadURI(dataURL, ` emojinator-${filename}.png`)
  })
}

function clearCanvas() {
  canvas.clear().renderAll()
  canvas.setHeight(SIZE)
  canvas.setWidth(SIZE)
}

function startOver() {
  clearCanvas()
  outputElement.src = ""
  outputElement.width = null
  showElement("canvas-container")
  hideElement("output")
  document.getElementById("embiggener-output").innerHTML = ""
  hideElement("embiggener-output")
}

function resetForm(event) {
  event.target.reset()
}

document.getElementById("form").onreset = resetForm
document.getElementById("clear-canvas").onclick = startOver
canvas.on("mouse:down", (e) => {
  if (e.target && e.target.type !== "image") {
    resetColours()
    loadColourFromObject(e.target)
    updateColourSelections()
  } else {
    hideColours()
  }
})
