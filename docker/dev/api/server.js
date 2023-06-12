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

// Exemplo de rota
app.get('/api/contest/:contestId/tags/:entityType/:entityId', db.getAnswerTable)
//app.get('/bkptable', db.getBkpTable)
//app.get('/clartable', db.getClarTable)
//app.get('/contesttable', db.getContestTable)
app.get('/langtable', db.getLangTable)
//app.get('/logtable', db.getLogTable)
app.get('/problemtable', db.getProblemTable)
//app.get('/runtable', db.getRunTable)
app.get('/sitetable', db.getSiteTable)
//app.get('/sitetimetable', db.getSiteTimeTable)
//app.get('/tasktable', db.getTaskTable)
app.get('/usertable', db.getUserTable)
app.get('/tag/api/contest/:contestId/tags/:entityType/:entityId', db.getByTag)

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});