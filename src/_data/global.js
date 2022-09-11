const md5 = require("md5")
const path = require("path")
const fs = require("fs")

module.exports = {
  baseUrl: process.env.BASE_URL || "https://emojinator.fun",
  cssFile() {
    const scssDir = path.join(__dirname, "..", "scss")
    const cssFile = fs.readFileSync(path.join(scssDir, "style.scss"))
    const hash = md5(cssFile).slice(0, 8)
    return `/css/style.${hash}.css`
  },
}
