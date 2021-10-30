document.getElementById("form").onsubmit = async function (event) {
  event.preventDefault()
  event.target.reset()

  const image = event.target.files[0]
  filename = event.target.files[0].name.split(".")[0]
  const src = await toBase64(image)
  const img = new Image()
  img.src = src
  onUploadImage(img)
}
document.getElementById("form").onreset = resetForm
document.getElementById("clear-canvas").onclick = startOver

function clearCanvas() {
  konvaImages = []
  baseLayer.destroyChildren()
  stage.width(SIZE)
  stage.height(SIZE)
  tr = generateTransformer()
  baseLayer.add(tr)
  stage.batchDraw()
}

function startOver() {
  clearCanvas()
  outputElement.src = ""
  outputElement.width = null
  showElement("canvas")
  hideElement("output")
  document.getElementById("embiggener-output").innerHTML = ""
  hideElement("embiggener-output")
}

function resetForm(event) {
  event.target.reset()
}

function selectSkintone(selectedSkintone) {
  const prevSkintone = skintone
  document
    .getElementById(`skintone-label-${prevSkintone}`)
    .classList.remove("selected")

  skintone = selectedSkintone
  document
    .getElementById(`skintone-label-${selectedSkintone}`)
    .classList.add("selected")

  Array.from(document.getElementsByClassName("tintable")).forEach((el) => {
    const filename = el.src.split("-")[0].replace(".svg", "")

    el.src =
      filename +
      (SKINTONES[skintone] === SKINTONES.a
        ? ".svg"
        : `-${SKINTONES[skintone]}.svg`)
  })
}

function init() {
  document.getElementById("download").addEventListener("click", (e) => {
    e.preventDefault()
    fitToScreen(() => {
      tr.nodes([])
      var dataURL = stage.toDataURL()
      downloadURI(dataURL, `emojinator-${filename}.png`)
    })
  })

  // Array.from(document.getElementsByClassName("skintone-picker-input")).forEach(
  //   (el) =>
  //     (el.onchange = (el) => {
  //       selectSkintone(el.target.value)
  //     })
  // )

  Array.from(document.getElementsByClassName("selector-option")).forEach(
    (el) => (el.onclick = onItemClick)
  )
  // stage.add(baseLayer)
  // baseLayer.add(tr)
  // baseLayer.add(selectionRectangle)
  // baseLayer.batchDraw()

  const debug = new URL(window.location.href).searchParams.get("debug")
  if (debug === "true") {
    img.src = "/images/debug.png"
    onUploadImage(img)
  }
}

// selectSkintone("a")
init()
