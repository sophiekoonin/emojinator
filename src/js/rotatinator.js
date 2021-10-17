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

document.getElementById("rotatinate-button").onclick = () => rotate()
