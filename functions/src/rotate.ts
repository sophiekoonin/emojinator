import * as express from 'express'

// import * as functions from 'firebase-functions'

const gm = require('gm').subClass({imageMagick: true});
export default function rotate(req: express.Request, res: express.Response) {
  // @ts-ignore
  const img = gm(req.files[0].buffer).command("convert").dispose("previous").in("-distort SRT \"1,%[fx:t*360/n]\"", "-duplicate 30").virtualPixel("transparent").set("delay", 8).loop(0).stream();

  // .toBuffer('GIF',function (err, buffer) {
  //   if (err) res.status(500).send(err);
  //   res.contentType('image/gif');
  //   res.send(buffer)
  // })

  res.send(img)
}