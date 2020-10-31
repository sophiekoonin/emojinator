import * as express from 'express'
import { createCanvas, Image } from 'canvas'
const GIFEncoder = require('gif-encoder-2')

// import * as functions from 'firebase-functions'

const baseNumSteps = 30

export default function rotate(req: express.Request, res: express.Response) {
  // @ts-ignore-next-line
  const buffer = req.files[0].buffer
  const { speed } = req.body || 1
  const image = new Image()
  image.src = buffer
  const width = image.width + image.width / 2
  const height = image.height + image.width / 2
  const canvas = createCanvas(width, height)
  const encoder = new GIFEncoder(width, height)
  encoder.setTransparent(true)
  encoder.start()
  const ctx = canvas.getContext('2d')

  const numSteps = baseNumSteps * parseInt(speed)

  const rotationInDegrees = 360 / numSteps

  for (let i = 0; i < numSteps; i++) {
    ctx.save()
    ctx.clearRect(0, 0, width, height)

    ctx.translate(width / 2, height / 2) // set canvas context to centre
    ctx.rotate(i * (rotationInDegrees * (Math.PI / 180)))
    ctx.drawImage(image, -image.width / 2, -image.height / 2)

    encoder.addFrame(ctx)
    ctx.restore()
  }
  encoder.finish()
  const outBuf = Buffer.from(encoder.out.getData())
  res.set('Content-Type', 'image/gif')

  res.send(outBuf)
}
