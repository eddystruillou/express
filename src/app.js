import express from 'express'
import bodyParser from 'body-parser'
import config from 'config'
import socketio from 'socket.io'
import { Movie } from './db/movie.model'
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
  async (req, res) => {
    const filteredMovies = await Movie.find({}).select('-synopsis')
    res.send(filteredMovies)
  }
);

app.post('/Movies', async (req, res) => {
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
  
  let savedMovie
  if(id) {
    savedMovie = await Movie.findById(parseInt(id))
    if(!savedMovie) {
      return res.status(404).send("Echec de l'update")
    }
    savedMovie.title = title
    savedMovie.imagesURL = imagesURL
    savedMovie.synopsis = synopsis
    io.emit('update-movie', savedMovie)
  } else {
    savedMovie = new Movie({ title, imagesURL, synopsis })
    io.emit('insert-movie', savedMovie)
  }
  await savedMovie.save()
  res.send(savedMovie)
})

app.get('/filtreMovies/:id',
  async (req, res) => {
    const movie = await Movie.findById(parseInt(req.params.id))
    if(!movie) {
      return res.status(404).send('Film introuvable')
    }
    res.send(movie)
  }
)

app.delete('/Delete/:id', 
  async(req, res) => {
    const movie = await Movie.deleteOne({ _id: parseInt(req.params.id) })
    io.emit('delete-movie', movie.id)
    res.status(204).send('Film DELETE !')
  }
)

export default app 