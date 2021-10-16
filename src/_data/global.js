module.exports = {
  baseUrl: process.env.BASE_URL || "https://emojinator.fun",
  random() {
    const segment = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }
    return `${segment()}-${segment()}-${segment()}`
  },
}
