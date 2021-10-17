function reset(event) {
  event.target.reset()
  document.getElementById("output").classList.add("hidden")
  document.getElementById("submit").setAttribute("disabled", 1)
}

function embiggenFormSubmit(event) {
  event.preventDefault()
  embiggen(event, img)
}

document.getElementById("embiggen-input").onchange = onImageSelect
document.getElementById("form").onsubmit = embiggenFormSubmit
