// const gm = require('gm').subClass({imageMagick: true});
// const fs = require('fs');
// const {promisify} = require('util');
// const path = require('path');
import * as functions from 'firebase-functions';

export const rotate = functions.https.onRequest((request, response) => {
  response.sendStatus(200)
})