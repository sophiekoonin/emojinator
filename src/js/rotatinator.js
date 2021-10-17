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

  gif.on("finished", function (blob) {
    const imgUrl = URL.createObjectURL(blob)
    const downloadButton = document.getElementById("download")
    const output = document.getElementById("output")
    output.src = imgUrl
    output.width = width
    document.getElementById("canvas").classList.add("hidden")
    downloadButton.onclick = function (event) {
      downloadURI(imgUrl, `rotating-${filename}.png`)
    }
    clearCanvas()
    gif.freeWorkers.forEach((w) => w.terminate())
  })

  for (let i = 0; i < numSteps; i++) {
    ctx.clearRect(0, 0, width, height)
    ctx.save()
    ctx.translate(width / 2, height / 2) // set canvas context to centre
    ctx.rotate(i * (rotationInDegrees * (Math.PI / 180)))

    ctx.drawImage(image, -width / 2, -height / 2, width, height)
    gif.addFrame(ctx, {
      width: width,
      height: height,
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

document.getElementById("rotatinate-button").onclick = () => rotate()
