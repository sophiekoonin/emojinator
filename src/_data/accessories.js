const bases = require("./accessories/bases.json")
const eyes = require("./accessories/eyes.json")
const hats = require("./accessories/hats.json")
const mouths = require("./accessories/mouths.json")
const hands = require("./accessories/hands.json")
const misc = require("./accessories/misc.json")

module.exports = [
  {
    heading: "Bases",
    name: "bases",
    items: bases,
  },
  {
    heading: "Eyes",
    name: "eyes",
    items: eyes,
  },
  {
    heading: "Hats & hair",
    name: "hats",
    items: hats,
  },
  {
    heading: "Mouths & facial features",
    name: "mouths",
    items: mouths,
  },
  {
    heading: "Hands",
    name: "hands",
    items: hands,
  },
  {
    heading: "Misc",
    name: "misc",
    items: misc,
  },
]
