const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

// Routes to Handle Request
const userRoute = require('../backend/routes/user.route')

// MongoDB Setup
mongoose
  .connect('mongodb+srv://lincolnwu:lincolnwu@cluster0.ujhyp.mongodb.net/testupload2?retryWrites=true&w=majority')
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err.reason)
  })

// Setup Express.js
const app = express()
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
)
app.use(cors())

// Make Images "Uploads" Folder Publicly Available
app.use('/public', express.static('public'))

// API Route
app.use('/api', userRoute)

// Error favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204))

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// Error
app.use((req, res, next) => {
  // Error goes via `next()` method
  setImmediate(() => {
    next(new Error('Something went wrong'))
  })
})

app.use(function (err, req, res, next) {
  console.error(err.message)
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.message)
})
