/* GLOBALS AND CONSTANTS */

/* CONSTANTS */
const MAX_GIF_SIZE = 128
const SIZE = MAX_GIF_SIZE + MAX_GIF_SIZE / 2

/* ELEMENTS */

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")
const img = new Image()
const outputElement = document.getElementById("output")
const canvasContainer = document.getElementById("canvas")

/* KONVA */
// Array of images that we've added to the konva canvas
let konvaImages = []

const selectionRectangle = new Konva.Rect({
  id: "selectionRectangle",
  visible: false,
  fill: "rgba(165, 247, 239, 0.5)",
})

const stage = new Konva.Stage({
  container: "canvas",
  width: SIZE,
  height: SIZE,
})

const baseLayer = new Konva.Layer()
let tr = generateTransformer()
let x1, y1, x2, y2
let filename = "image"

/* GLOBALS */
// selected skin tone
let skintone = "a"
const SKINTONES = Object.freeze({
  a: "base",
  b: "1f3fb",
  c: "1f3fc",
  d: "1f3fd",
  e: "1f3fe",
  f: "1f3ff",
})
