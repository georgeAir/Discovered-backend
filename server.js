require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI
const cors = require('cors');
const session = require('express-session')
const apiKey = process.env.REACT_APP_API_KEY
const spotifyWebApi = require('spotify-web-api-node')
const bodyParser = require("body-parser")
// const lyricsFinder = require("lyrics-finder")
const PORT = 3001

const client = '68c3d880825447e29248824c775e403b'

//SETUP CORS middleware
const whitelist = ['http://localhost:3000', '']
const corsOptions = {
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else {
            callback(new Error('Not allowed by CORS'))
        }
    },

    credentials:true
}

app.use(cors(corsOptions))


const SESSION_SECRET = process.env.SESSION_SECRET

// app.set('trust proxy', 1)

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // store: new MongoDBStore({
    //     uri: process.env.MONGODB_URI,
    //     collection: 'mySessions'
    // }),
    // cookie: {
    //     sameSite: 'none',
    //     secure: true
    // }
}))


//SETUP mongoose
const db = mongoose.connection;
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
},  ()=> {
    console.log('database connection established')
});

db.on('error', (err) => {console.log('ERROR: ', err) })
db.on('connected', () => {console.log('mongo connected') })
db.on('disconnected', () => {console.log('mongo disconnected') })

const isAuthenticated = (req, res, next) => {
    console.log(req.session.currentUser)
    if(req.session.currentUser){
        next()
    }else {
        res.status(403).json({message: "login is required"})
    }
}

//this will tell server to parse JSON data, and create req.body object.
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


//controllers
app.use('/playlists', require('./controllers/playlistsController'));


app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  })

  spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      })
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
})

app.post("/login", (req, res) => {
  const code = req.body.code
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(err => {
      res.sendStatus(400)
    })
})

app.get("/lyrics", async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
  res.json({ lyrics })
})




app.listen(PORT, ()=> {
    console.log('listening on port 3001')
})
