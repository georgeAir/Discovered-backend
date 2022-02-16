const express = require('express')
const playlists = express.Router()
const Playlist = require('../models/playlists')

// GET (index) list of playlist
playlists.get('/', (req, res) => {
  Playlist.find({}, (error, foundPlaylists) => {
    if(error) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(200).json(foundPlaylists)
    }
  })
})

// POST create a playlist
playlists.post('/', (req, res) => {
  Playlist.create(req.body, (error, createdPlaylist) => {
    if(error) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(200).json(createdPlaylist)
    }
  })
})

// DELETE delete a playlist
playlists.delete('/:id', (req, res) => {
  Playlist.findByIdAndDelete(req.params.id, (error, deletedPlaylist) => {
    if(error) {
      res.status(400).json({ error: error.message })
    } else if (deletedPlaylist === null) {
      res.status(404).json({ message: 'Playlist id not Found'})
    } else {
      res.status(200).json({ message: `Playlist ${deletedPlaylist.name} deleted successfully`})
    }
  })
})

// UPDATE update a playlist
playlists.put('/:id', (req, res) => {
  Playlist.findByIdAndUpdate(req.params.id, req.body, {new:true}, (error, updatedPlaylist) => {
    if (error) {
      res.status(400).json( {error: error.message })
    } else {
      res.status(200).json({
        message: `Playlist ${updatedPlaylist.id} updated successfully`,
        data: updatedPlaylist
      })
    }
  })
})

// PATCH -- increments number of likes
playlists.patch('/addlikes/:id', (req, res) => {
  Playlist.findByIdAndUpdate(req.params.id, { $inc: {likes: 1}}, {new:true}, (error, updatedPlaylist) => {
    if(error) {
      res.status(400).json({error: error.message})
    } else {
      res.status(200).json({data: updatedPlaylist})
    }
  })
})

module.exports = playlists
