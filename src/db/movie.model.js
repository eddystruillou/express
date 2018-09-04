import mongoose, { Schema } from 'mongoose'

//L'objet est l'instance de la classe !
const MovieSchema = new Schema({
  _id: { type: Number, default: Date.now },
  title: { type: String, required: true },
  imagesURL: { type: String, required: true },
  synopsis: { type: String, required: true }
})

export const Movie = mongoose.model('Movie', MovieSchema)