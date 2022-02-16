const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const usersSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    favHolidays: [{
        type: Schema.Types.ObjectId,
        ref: 'Playlist',
    }]
})


module.exports = model('User', usersSchema)
