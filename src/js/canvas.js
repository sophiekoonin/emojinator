/* UTILS */
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

function scaleDimensions(longerSide, shorterSide, maxSize) {
  const longScaled = Math.min(longerSide, maxSize)
  const shortScaled = (longScaled / longerSide) * shorterSide
  return [longScaled, shortScaled]
}

function getScaledImageDimensions(width = MAX_GIF_SIZE, height = MAX_GIF_SIZE, maxSize = MAX_GIF_SIZE) {
  const imageAspectRatio = width / height
  // width < height
  if (imageAspectRatio < 1) {
    const [newHeight, newWidth] = scaleDimensions(height, width, maxSize)

    return {
      width: newWidth,
      height: newHeight,
    }
  }

  // width > height
  if (imageAspectRatio > 1) {
    const [newWidth, newHeight] = scaleDimensions(width, height, maxSize)

    return {
      width: newWidth,
      height: newHeight,
    }
  }

  // width = height
  const newSize = Math.max(Math.min(width, maxSize), MAX_GIF_SIZE)
  return {
    width: newSize,
    height: newSize,
  }
}


function downloadURI(uri, name) {
  const link = document.createElement('a')
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  delete link
}


function hideElement(id) {
  document.getElementById(id).classList.add('hidden')
}

function showElement(id) {
  document.getElementById(id).classList.remove('hidden')
}

function renderAndDownloadGif(blob, filename, width, gif) {
  const imgUrl = URL.createObjectURL(blob)
  const downloadButton = document.getElementById("download")
  outputElement.src = imgUrl
  outputElement.width = width
  hideElement("canvas-container")
  showElement("output")
  downloadButton.onclick = function () {
    downloadURI(imgUrl, `${filename}.png`)
  }
  clearCanvas()
  gif.freeWorkers.forEach((w) => w.terminate())
}

/* GLOBALS AND CONSTANTS */

/* CONSTANTS */
const MAX_GIF_SIZE = 128
const SIZE = 200
let filename = "image"
/* ELEMENTS FOR GIF OUTPUT */
const gifCanvas = document.createElement("canvas")
const ctx = gifCanvas.getContext("2d")
const outputElement = document.getElementById("output")

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

const hairColours = Object.freeze({
  blonde: "#FFE51F",
  lightbrown: "#963B22",
  darkbrown: "#603529",
  lightblack: "#292F33",
  darkblack: "#0C0200",
  lightred: "#FFAC32",
  darkred: "#E95F27",
  grey: "#E1E8EC",
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

function doColourChange(colourType, colour){
  canvas.getActiveObjects().forEach((obj) => {
    if (typeof obj.size !== "undefined") {
      // this is a group, so iterate
      obj.forEachObject((o) => {
        if (o.colorType === colourType) {
          o.set({ fill: colour })
        }
      })
    } else {
      if (obj.colorType === colourType) {
        obj.set({ fill: colour })
      }
    }
  })
  canvas.renderAll()
}

function chooseHairPreset(col) {
  const colour = hairColours[col]
  selectedColours.primary = colour
  document.getElementById("primary-color").value = colour
  showElement("primary-color-label")
  doColourChange("primary", colour)
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
          o.set({ fill: SKINTONES[skintone][o.colorType] })
        }
      })
    } else {
      if (obj.isSkin) {
        obj.set({ fill: SKINTONES[skintone][obj.colorType] })
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
  doColourChange(changedColourType, value)
}

/* RENDERING STUFF */

// The main emojinator canvas
const canvas = new fabric.Canvas("c", {
  width: SIZE,
  height: SIZE,
})
canvas.preserveObjectStacking = true;

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

  const type = itemEl.getAttribute("data-type") || itemEl.firstElementChild?.getAttribute("data-type") || "any"
  const qty = itemEl.getAttribute("data-qty") || 1

  resetColours()

  // SVG width/height properties are not the same as image width/height properties
  // so if these properties don't return a number, get it off the SVG itself.
  const itemWidth =
    typeof itemEl.width === "number"
      ? itemEl.width
      : Number(itemEl.getAttribute("width") || 0)

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
        if (type === "hair") {
          showElement("hair-preset-list")
        } else {
          hideElement("hair-preset-list")
        }
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
    objectInstance.clone((obj) => {
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
  const { width } = getScaledImageDimensions(
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


/* SPECIAL */
/* PARTYIZER */
// With heartfelt thanks to Ændrew Rininsland for the partyizer code
// https://github.com/aendrew/party-everything

const PARROT_COLORS = [
  "#FDD58E",
  "#8CFD8E",
  "#8CFFFE",
  "#8DB6FB",
  "#D690FC",
  "#FD90FD",
  "#FD6EF4",
  "#FC6FB6",
  "#FD6A6B",
  "#FD8E8D",
]

function partyizeToGif(image) {
  const width = image.width
  const height = image.height
  var gif = new GIF({
    workers: 2,
    repeat: 0,
    quality: 10,
    width,
    height,
    transparent: true,
    workerScript:
      window.location.protocol +
      "//" +
      window.location.host +
      "/scripts/gif.worker.js",
  })
  gif.on("finished", (blob) =>
    renderAndDownloadGif(blob, `party-${filename ?? "emoji"}`, width, gif)
  )

  for (const base of PARROT_COLORS) {
    ctx.save()
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(image, 0, 0, width, height)
    ctx.globalCompositeOperation = "source-atop"
    ctx.fillStyle = base
    ctx.globalAlpha = 0.4
    ctx.fillRect(0, 0, width, height)
    gif.addFrame(ctx, { delay: 8, copy: true })
    ctx.restore()
  }
  gif.render()
}

function getImageAndThen(callback, skipScale) {
  if (canvas.getObjects().length === 0) return

  const getCanvasToDataURL = () => {
    const img = new Image()
    img.onload = function () {
      callback(img)
    }
    img.src = canvas.toDataURL()
    img.width = canvas.width 
    img.height = canvas.height 
  }
  skipScale ?  getCanvasToDataURL() : scaleCanvas(getCanvasToDataURL) 
}

/* ROTATINATOR */
function rotateAndRenderGif(image) {
  const numSteps = 30
  const width = image.width
  const height = image.height
  const canvasWidth = width + 25
  const canvasHeight = height + 25
  const rotationInDegrees = 360 / numSteps
  var gif = new GIF({
    workers: 2,
    repeat: 0,
    quality: 10,
    width: canvasWidth,
    height: canvasHeight,
    transparent: true,
    workerScript:
      window.location.protocol +
      "//" +
      window.location.host +
      "/scripts/gif.worker.js",
  })

  gif.on("finished", (blob) =>
    renderAndDownloadGif(blob, `rotating-${filename ?? "emoji"}`, width, gif)
  )

  gifCanvas.width = canvasWidth 
  gifCanvas.height = canvasHeight 
  for (let i = 0; i < numSteps; i++) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
    ctx.save()
    ctx.translate(canvasWidth / 2, canvasHeight / 2) // set canvas context to centre
    ctx.rotate(i * (rotationInDegrees * (Math.PI / 180)))

    ctx.drawImage(image, -width / 2, -height / 2, width, height)
    gif.addFrame(ctx, {
      width,
      height,
      delay: 0.5,
      copy: true,
    })
    ctx.restore()
  }
  gif.render()
}

/* EMBIGGENER */
function generateOutputs() {
  const output1 = document.createElement("a")
  output1.id = "link1"
  output1.innerHTML = '<img id="output1" alt="download top left"/>'
  const output2 = document.createElement("a")
  output2.id = "link2"
  output2.innerHTML = '<img id="output2" alt="download top right"/>'
  const output3 = document.createElement("a")
  output3.id = "link3"
  output3.innerHTML = '<img id="output3" alt="download bottom left"/>'
  const output4 = document.createElement("a")
  output4.id = "link4"
  output4.innerHTML = '<img id="output4" alt="download bottom right"/>'
  const output = document.getElementById("embiggener-output")
  output.appendChild(output1)
  output.appendChild(output2)
  output.appendChild(output3)
  output.appendChild(output4)
}

function embiggen(image) {
  if (document.getElementById("output1") != null) {
    return
  }
  generateOutputs()
  const width = image.width
  const height = image.height
  const segmentWidth = width / 2
  const segmentHeight = height / 2
  gifCanvas.width = segmentWidth
  gifCanvas.height = segmentHeight

  ctx.save()
  // top left
  ctx.drawImage(
    image,
    0,
    0,
    image.width / 2,
    image.height / 2,
    0,
    0,
    segmentWidth,
    segmentHeight
  )
  const img1 = gifCanvas.toDataURL()
  document.getElementById("output1").src = img1

  const link1 = document.getElementById("link1")
  link1.href = img1
  link1.download = `${filename}-topleft.png`

  // top right
  ctx.clearRect(0, 0, segmentWidth, segmentHeight)
  ctx.restore()

  ctx.drawImage(
    image,
    image.width / 2,
    0,
    image.width / 2,
    image.height / 2,
    0,
    0,
    segmentWidth,
    segmentHeight
  )
  const img2 = gifCanvas.toDataURL()
  document.getElementById("output2").src = img2
  const link2 = document.getElementById("link2")
  link2.href = img2
  link2.download = `${filename}-topright.png`

  // bottom left
  ctx.clearRect(0, 0, segmentWidth, segmentHeight)
  ctx.restore()

  ctx.drawImage(
    image,
    0,
    image.height / 2,
    image.width / 2,
    image.height / 2,
    0,
    0,
    segmentWidth,
    segmentHeight
  )
  const img3 = gifCanvas.toDataURL()
  document.getElementById("output3").src = img3

  const link3 = document.getElementById("link3")
  link3.href = img3
  link3.download = `${filename}-bottomleft.png`

  // bottom right
  ctx.clearRect(0, 0, segmentWidth, segmentHeight)
  ctx.restore()

  ctx.drawImage(
    image,
    image.width / 2,
    image.height / 2,
    image.width / 2,
    image.height / 2,
    0,
    0,
    segmentWidth,
    segmentHeight
  )
  const img4 = gifCanvas.toDataURL()
  document.getElementById("output4").src = img4
  const link4 = document.getElementById("link4")
  link4.href = img4
  link4.download = `${filename}-bottomright.png`
  document.getElementById("download").setAttribute("disabled", true)
  document.getElementById(
    "embiggener-output"
  ).style = `max-width: ${image.width}px;`
  showElement("embiggener-output")
  hideElement("canvas-container")
}

/* RED */
function makeRed(image) {
  canvas.width = image.width
  canvas.height = image.height
  clearCanvas()
  const filterImg = new fabric.Image(image, {
    centeredRotation: true,
    centeredScaling: true,
    left: SIZE / 2,
    top: SIZE / 2,
    originY: "center",
    originX: "center",
  })
  canvas.add(filterImg).renderAll()
  const filter = new fabric.Image.filters.BlendColor({
    color: "#cc0000",
    mode: "overlay",
  })
  filterImg.filters = [filter]
  filterImg.applyFilters()
  canvas.renderAll()
}

/* INIT */
function initSpecial() {
  document.getElementById("partyize-button").onclick = () =>
    getImageAndThen(partyizeToGif)
  document.getElementById("rotatinate-button").onclick = () =>
    getImageAndThen(rotateAndRenderGif, true)
  document.getElementById("embiggen-button").onclick = () =>
    getImageAndThen(embiggen)
  document.getElementById("red-button").onclick = () => getImageAndThen(makeRed)
}



/* TOOLBAR BUTTONS */
function initToolbar() {
  document.getElementById("move-up").onclick = () => {
    forEachActiveObject((obj) => obj.bringForward())
  }
  document.getElementById("move-down").onclick = () => {
    forEachActiveObject((obj) => obj.sendBackwards())
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

Object.keys(hairColours).forEach(c => {
  const el = document.getElementById(`hair-preset-${c}`)
  el.onclick = () => {
    chooseHairPreset(c)
  }
})

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
        canvas.clear().renderAll()
        canvas.setHeight(group.height)
        canvas.setWidth(group.width)
        group.set({ top: 0, left: 0 })
        canvas.add(group).renderAll()
        callback()
      }
    })
  })
}



document.getElementById("download").onclick = () => {
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
  document.getElementById("download").removeAttribute("disabled")
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
    if (e.target.accessoryType === "hair") {
      showElement("hair-preset-list")
    } else {
      hideElement("hair-preset-list")
    }    
  } else {
    hideColours()
  }
})

document.getElementById("form").onsubmit = async function (event) {
  event.preventDefault()
  const image = Array.from(event.target).find((el) => el.files).files[0]
  filename = image.name.split(".")[0]
  const src = await toBase64(image)
  const img = new Image()
  img.onload = () => {
    onUploadImage(img)
  }
  img.src = src
}

initSpecial()
