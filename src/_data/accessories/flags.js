const twemoji = require("twemoji")
const emojis = require("emojibase-data/en-gb/data.json")

module.exports = [
  ...emojis
    .filter(
      (e) =>
        e.tags &&
        (e.tags.includes("flag") ||
          ["rainbow flag", "pirate flag"].includes(e.label))
    )
    .map((e) => {
      return {
        name: e.label,
        type: "remote",
        src: `https://twemoji.maxcdn.com/v/latest/72x72/${e.hexcode.toLowerCase()}.png`,
      }
    }),
]
