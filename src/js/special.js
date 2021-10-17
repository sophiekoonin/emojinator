/* UTILS */
function renderAndDownloadGif(blob, filename, width) {
  const imgUrl = URL.createObjectURL(blob)
  const downloadButton = document.getElementById("download")
  outputElement.src = imgUrl
  outputElement.width = width
  canvasContainer.classList.add("hidden")
  downloadButton.onclick = function (event) {
    downloadURI(imgUrl, `-${filename}.png`)
  }
  clearCanvas()
  gif.freeWorkers.forEach((w) => w.terminate())
}

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
  const width = stage.width()
  const height = stage.height()
  canvas.width = width
  canvas.height = height

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
    renderAndDownloadGif(blob, `party-${filename ?? "emoji"}`, width)
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

function getImageAndThen(callback) {
  fitToScreen(() => {
    tr.nodes([])
    stage.toImage({ callback })
  })
}

/* ROTATINATOR */
function rotateAndRenderGif(image) {
  const numSteps = 30
  const width = stage.width()
  const height = stage.height()
  const rotationInDegrees = 360 / numSteps
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
    renderAndDownloadGif(blob, `rotating-${filename ?? "emoji"}`, width)
  )

  for (let i = 0; i < numSteps; i++) {
    ctx.clearRect(0, 0, width, height)
    ctx.save()
    ctx.translate(width / 2, height / 2) // set canvas context to centre
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

function rotate() {
  fitToScreen(() => {
    tr.nodes([])
    stage.toImage({ callback: rotateAndRenderGif })
  })
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
  const width = stage.width()
  const height = stage.height()
  const segmentWidth = width / 2
  const segmentHeight = height / 2
  canvas.width = segmentWidth
  canvas.height = segmentHeight

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
  const img1 = canvas.toDataURL()
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
  const img2 = canvas.toDataURL()
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
  const img3 = canvas.toDataURL()
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
  const img4 = canvas.toDataURL()
  document.getElementById("output4").src = img4
  const link4 = document.getElementById("link4")
  link4.href = img4
  link4.download = `${filename}-bottomright.png`
  document.getElementById("download").setAttribute("disabled", true)
  document.getElementById(
    "embiggener-output"
  ).style = `max-width: ${image.width}px;`
  showElement("embiggener-output")
  hideElement("canvas")
}

/* RED */
function makeRed(image) {
  const width = stage.width()
  const height = stage.height()
  canvas.width = width
  canvas.height = height

  ctx.drawImage(image, 0, 0, width, height)

  let imgData = ctx.getImageData(0, 0, width, height),
    x,
    y,
    i,
    grey

  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      i = (y * width + x) * 4

      grey = window.parseInt(
        0.2125 * imgData.data[i] +
          0.7154 * imgData.data[i + 1] +
          0.0721 * imgData.data[i + 2],
        10
      )

      imgData.data[i] += grey - imgData.data[i]
      imgData.data[i + 1] += grey - imgData.data[i + 1]
      imgData.data[i + 2] += grey - imgData.data[i + 2]
    }
  }
  ctx.putImageData(imgData, 0, 0)
  ctx.globalCompositeOperation = "source-atop"
  ctx.fillStyle = "#cc0000"
  ctx.globalAlpha = 0.6
  ctx.fillRect(0, 0, width, height)
  clearCanvas()
  img.src = canvas.toDataURL()
  baseLayer.add(
    new Konva.Image({
      image: img,
      draggable: true,
    })
  )
}

/* INIT */
function initSpecial() {
  document.getElementById("partyize-button").onclick = () =>
    getImageAndThen(partyizeToGif)
  document.getElementById("rotatinate-button").onclick = () =>
    getImageAndThen(rotateAndRenderGif)
  document.getElementById("embiggen-button").onclick = () =>
    getImageAndThen(embiggen)
  document.getElementById("red-button").onclick = () => getImageAndThen(makeRed)
}

initSpecial()
