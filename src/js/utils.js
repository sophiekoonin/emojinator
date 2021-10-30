function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

function scaleDimensions(longerSide, shorterSide, maxSize) {
  const longScaled = Math.min(longerSide, maxSize)
  const shortScaled = (longScaled / longerSide) * shorterSide
  return [longScaled, shortScaled]
}

function getScaledImageDimensions(width = MAX_GIF_SIZE, height = MAX_GIF_SIZE, maxSize = MAX_GIF_SIZE) {
  const imageAspectRatio = width / height
  // width < height
  if (imageAspectRatio < 1) {
    const [newHeight, newWidth] = scaleDimensions(height, width, maxSize)

    return {
      width: newWidth,
      height: newHeight,
    }
  }

  // width > height
  if (imageAspectRatio > 1) {
    const [newWidth, newHeight] = scaleDimensions(width, height, maxSize)

    return {
      width: newWidth,
      height: newHeight,
    }
  }

  // width = height
  const newSize = Math.max(Math.min(width, maxSize), MAX_GIF_SIZE)
  return {
    width: newSize,
    height: newSize,
  }
}

async function onImageSelect(event) {

}

function downloadURI(uri, name) {
  const link = document.createElement('a')
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  delete link
}


function hideElement(id) {
  document.getElementById(id).classList.add('hidden')
}

function showElement(id) {
  document.getElementById(id).classList.remove('hidden')
}