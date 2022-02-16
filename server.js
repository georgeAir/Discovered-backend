require('dotenv').config()
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI
const cors = require('cors');
const session = require('express-session')
const apiKey = process.env.REACT_APP_API_KEY
const PORT = 3003
// const MongoDBStore = require('connect-mongodb-session')(session)
// const apiKey = "ue2_GLAE9FpEp0NX5hhSw_6qzFoN-MlrnL1Sm7BJUnuixUy4u3MnLp_FqUxqpbyMTzqkqLujFbQRfOgFZUP19cxZo5da-uDeU3OnQJ1KhmPZg1LZssAXl494sszyYXYx"
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



//controllers
app.use('/playlists', require('./controllers/playlistsController'));


app.get('/yelp/', (req, res) => {
  const searchRequest = {
    all: req.params.term,
    location: 'chicago'
  }

  client.search(searchRequest)
  .then(response => response.jsonBody.businesses)
  .then(data => res.send(data));
})


app.get('/yelp/:term', (req, res) => {
  const searchRequest = {
    term: req.params.term,
    location: 'chicago'
  }

  client.search(searchRequest)
  .then(response => response.jsonBody.businesses)
  .then(data => res.send(data));
})




app.listen(PORT, ()=> {
    console.log('listening on port 3003')
})
