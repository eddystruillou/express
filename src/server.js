/* const express = require('express'); Première mamnière de faire*/
import express from 'express'
import bodyParser from 'body-parser'
const app = express();
const fs = require("fs")

app.use((req, res, next) => {
  setTimeout(next, 2000)
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8081')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
});

app.use(bodyParser.json())

app.use('/images', express.static('public/images'));


app.get('/Movies', 
  (req, res) => {
    let rawdata = fs.readFileSync('./movies.json')
    let movies = JSON.parse(rawdata)
    const filteredMovies = movies.map(movie => {
      return {
        id: movie.id,
        title: movie.title,
        imagesURL: movie.imagesURL
      }
    })
    res.send(filteredMovies)
  }
);

app.post('/Movies',
  (req, res) => {
    //#1 id du film
    const id = Date.now()
/*     const title = req.body.title
    const imagesURL = req.body.imagesURL
    const synopsis = req.body.synopsis */

    const { title, imagesURL, synopsis } = req.body

    const newMovie = {id, title, imagesURL, synopsis }
    console.log(newMovie)

    //#2 ecriture fichier
    let rawdata = fs.readFileSync('./movies.json')
    let movies = JSON.parse(rawdata)
    movies.push(newMovie)
    fs.writeFileSync('./movies.json', JSON.stringify(movies))

    res.send(newMovie)
})

app.get('/filtreMovies/:id',
  (req, res) => {
    const fs = require("fs")
    let rawdata = fs.readFileSync('./movies.json')
    let movies = JSON.parse(rawdata)
    const movie = movies.find(movie => {
      return movie.id == req.params.id
    })
    res.send(movie)
  }
)

app.listen(5000, () => console.log('started'));

/* const filteredMovies = movies.map(movie => {
  return {
    title: movie.title,
    url: movie.url
  }
})

const filteredMovies = movies.map(({title, url}) => {
  return {title, url}
}) */