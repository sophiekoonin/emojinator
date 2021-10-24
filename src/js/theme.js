document.documentElement.classList.remove("no-js")
// thx Andy Bell: https://hankchizljaw.com/wrote/create-a-user-controlled-dark-or-light-mode/
const COLOR_STORAGE_KEY = "user-color-scheme"
const COLOR_VAR = "--color-mode"
const darkModeCheckbox = document.querySelector("#toggle-checkbox")
const toggleSlider = document.querySelector(".toggle-slider")
const getCSSCustomProp = (propKey) => {
  let response = getComputedStyle(document.documentElement).getPropertyValue(
    propKey
  )

  if (response.length) {
    response = response.replace(/\"|'/g, "").trim()
  }

  return response
}

const getCurrentSetting = (passedSetting, dataName, storageKey, cssVar) => {
  let currentSetting = passedSetting || localStorage.getItem(storageKey)

  if (currentSetting) {
    document.documentElement.setAttribute(dataName, currentSetting)
  } else {
    currentSetting = getCSSCustomProp(cssVar)
  }
  return currentSetting
}
const applyColorSetting = (passedSetting) => {
  const currentSetting = getCurrentSetting(
    passedSetting,
    "data-user-color-scheme",
    COLOR_STORAGE_KEY,
    COLOR_VAR
  )
  darkModeCheckbox.checked = currentSetting === "dark"
}

const toggleColorSetting = () => {
  let currentSetting = localStorage.getItem(COLOR_STORAGE_KEY)

  switch (currentSetting) {
    case null:
      currentSetting = getCSSCustomProp(COLOR_VAR) === "dark" ? "light" : "dark"
      break
    case "light":
      currentSetting = "dark"
      break
    case "dark":
      currentSetting = "light"
      break
  }

  localStorage.setItem(COLOR_STORAGE_KEY, currentSetting)

  return currentSetting
}

function toggleAccordion(e) {
  const buttonEl = e.target
  const accordionContentId = buttonEl.getAttribute("data-contentid")
  const content = document.getElementById(accordionContentId)
  buttonEl.classList.toggle("is-open")
  content.classList.toggle("is-open")
  content.setAttribute(
    "aria-expanded",
    content.getAttribute("aria-expanded") === "false" ? "true" : "false"
  )
}
Array.from(document.getElementsByClassName("accordion-trigger")).forEach(
  (el) => {
    el.onclick = toggleAccordion
  }
)
darkModeCheckbox.addEventListener("click", (evt) => {
  applyColorSetting(toggleColorSetting())
})

applyColorSetting()
