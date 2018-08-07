/* const express = require('express'); Première mamnière de faire*/
import express from 'express'
const app = express();

app.get('/Et', (req, res) => {
  res
  .status(200)
  .setHeader('content-type', 'text/html')
  res.send('Mercéééééééééééééééé');
});

app.use((req, res, next) => {
  setTimeout(next, 3000)
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8081')
  next()
});

app.get('/Movies', 
  (req, res) => {
    const fs = require("fs")
    let rawdata = fs.readFileSync('./movies.json')
    let movies = JSON.parse(rawdata)
    res.send(movies)
  }
);

app.listen(5000, () => console.log('started'));
