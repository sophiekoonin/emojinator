import * as functions from 'firebase-functions'
import * as express from 'express'
// @ts-ignore
import * as expressParser from 'express-multipart-file-parser'

import rotate from './rotate'
const app = express()
app.use(expressParser)

app.get('/thing', (req: express.Request, res: express.Response) => {
  res.send('hello thing!')
})

app.post('/rotate', rotate)
app.get('/', (req: express.Request, res: express.Response) => {
  return res.send('hello world!')
})

exports.tools = functions.https.onRequest(app)
