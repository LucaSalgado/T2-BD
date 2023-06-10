'use strict';

const db = require('./queries');
const express = require('express');
const app = express();

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/test', db.getTest)

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});