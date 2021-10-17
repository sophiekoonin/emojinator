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

function partyize() {
  fitToScreen(() => {
    tr.nodes([])
    stage.toImage({ callback: partyizeToGif })
  })
}

document.getElementById("partyize-button").onclick = partyize
