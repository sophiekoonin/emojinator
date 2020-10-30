import * as functions from 'firebase-functions';
import * as express from 'express'

const app = express()

app.get('/', (req: express.Request, res: express.Response) => {
  res.send("hello world!")
})
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.tools = functions.https.onRequest(app)
