document.getElementById("form").onsubmit = async function (event) {
  event.preventDefault()
  const image = Array.from(event.target).find((el) => el.files).files[0]
  filename = image.name.split(".")[0]
  const src = await toBase64(image)
  const img = new Image()
  img.src = src
  onUploadImage(img)
}
document.getElementById("form").onreset = resetForm
document.getElementById("clear-canvas").onclick = startOver
