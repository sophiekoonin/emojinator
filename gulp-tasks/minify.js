const minify = require("gulp-minify")
const { dest, src } = require("gulp")

module.exports = function minifier() {
  return src("./src/js/*.js")
    .pipe(
      minify({
        noSource: true,
        ext: {
          min: ".js",
        },
        compress: process.env.NODE_ENV === "production",
      })
    )
    .pipe(dest("./dist/scripts"))
}
