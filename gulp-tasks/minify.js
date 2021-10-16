const minify = require("gulp-minify")
const { dest, src } = require("gulp")

module.exports = function minifier() {
  return src("./src/scripts/main.js")
    .pipe(minify())
    .pipe(dest("./dist/scripts"))
}
