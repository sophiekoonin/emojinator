const fs = require("fs")

module.exports = (config) => {
  config.addWatchTarget("./src")
  config.addPassthroughCopy({ "./src/assets": "/" })
  if (process.env.NODE_ENV !== "production") {
    config.addPassthroughCopy({ "./src/js": "/scripts" })
  }
  // Tell 11ty to use the .eleventyignore and ignore our .gitignore file
  config.setUseGitIgnore(false)
  return {
    dir: {
      input: "src",
      output: "dist",
    },
    markdownTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  }
}
