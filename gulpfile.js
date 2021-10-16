const { parallel, watch } = require("gulp")

// Pull in each task
const sass = require("./gulp-tasks/sass.js")
const minifier = require("./gulp-tasks/minify.js")
// Set each directory and contents that we want to watch and
// assign the relevant task. `ignoreInitial` set to true will
// prevent the task being run when we run `gulp watch`, but it
// will run when a file changes.
const watcher = () => {
  watch("./src/scss/**/*.scss", { ignoreInitial: true }, sass)
  watch("./src/scripts/**/*.js", { ignoreInitial: true }, minifier)
}

// The default (if someone just runs `gulp`) is to run each task in parallel
exports.default = parallel(sass, minifier)

// This is our watcher task that instructs gulp to watch directories and
// act accordingly
exports.watch = watcher
