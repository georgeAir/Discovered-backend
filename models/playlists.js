const mongoose = require('mongoose')
const { Schema, model } = mongoose

const playlistSchema = new Schema({
  number: {type: Number, default: false},
  title: {type: String, require: true},
  artist: {type: String, default: false},
  album: {type: String, default: false},
})

module.exports = model('Playlist', playlistSchema)
