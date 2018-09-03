import express from 'express'
import bodyParser from 'body-parser'
import config from 'config'
import fs from 'fs'
import socketio from 'socket.io'
//import { validVariable } from './test'
const app = express();
const io = socketio(5010)

app.use((req, res, next) => {
  setTimeout(next, config.get('timeout'))
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8081')
  res.header('Access-Control-Allow-Methods', 'DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
});

app.use(bodyParser.json())

app.use('/images', express.static('public/images'));


app.get('/Movies', 
  (req, res) => {
    let rawdata = fs.readFileSync(config.get("fichierJSON"))
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
  const { title, imagesURL, synopsis, id } = req.body
  
  function validateField(field, msg) {
    if(!field || field.trim().length === 0) {
      errors.push(msg)
    }
  }
  
  const errors = []
  validateField(title, 'Titre Obligatoire')
  validateField(imagesURL, 'Image Obligatoire')
  validateField(synopsis, 'Synopsis Obligatoire')
  if (errors.length > 0) return res.status(400).send(errors)
  
  // lecture fichier
  const rawdata = fs.readFileSync(config.get('fichierJSON'))
  const movies = JSON.parse(rawdata)
  
  let savedMovie
  if(id) {
    savedMovie = movies.find(movie => {
      return movie.id == id
    })
    if(!savedMovie) {
      return res.status(404).send("Echec de l'update")
    }
    savedMovie.title = title
    savedMovie.imagesURL = imagesURL
    savedMovie.synopsis = synopsis
    io.emit('update-movie', savedMovie)
  } else {
    savedMovie = { id: Date.now(), title, imagesURL, synopsis }
    io.emit('insert-movie', savedMovie)
    movies.push(savedMovie)
  }
    //#2 ecriture fichier
    fs.writeFileSync(config.get('fichierJSON'), JSON.stringify(movies))
    res.send(savedMovie)
})

app.get('/filtreMovies/:id',
  (req, res) => {
    let rawdata = fs.readFileSync(config.get('fichierJSON'))
    let movies = JSON.parse(rawdata)
    const movie = movies.find(movie => {
      return movie.id == req.params.id
    })
    if(!movie) {
      return res.status(404).send('Film introuvable')
    }
    res.send(movie)
  }
)

app.delete('/Delete/:id', 
  (req, res) => {
    let rawdata = fs.readFileSync(config.get('fichierJSON'))
    let movies = JSON.parse(rawdata)
    const movie = movies.find(movie => {
      return movie.id == req.params.id
    })
    if(!movie) {
      return res.status(404).send('Echec de la suppression')
    }
    movies.splice(movies.indexOf(movie), 1)
    io.emit('delete-movie', movie.id)
    fs.writeFileSync(config.get('fichierJSON'), JSON.stringify(movies))
    res.status(204).send('Film DELETE !')
  }
)

export default app 