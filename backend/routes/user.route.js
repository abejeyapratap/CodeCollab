const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const router = express.Router();
const mongodb = require('mongodb')
const binary = mongodb.Binary
const app = express()

const fileUpload = require('express-fileupload')
router.use(fileUpload())

// User model
let User = require('../models/User')

let currId = "";

// POST User
router.post('/create-user', (req, res, next) => {

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    codeContent: binary(req.files.codeContent.data).toString()
  })
  user
    .save()
    .then((result) => {
      console.log(result)
      currId = result._id;
      console.log("CURRENT ID: ", currId)
      res.status(201).json({
        message: 'User registered successfully!',
        userCreated: {
          _id: result._id,
          name: result.name,
          codeContent: result.codeContent,
        },
      })
    })
    .catch((err) => {
      console.log(err),
        res.status(500).json({
          error: err,
        })
    })
})

// GET All Users
router.get('/get-user', (req, res, next) => {
  console.log("ID to search: ", currId)
  User.findById(currId).then((data) => {
    console.log(data)
    res.status(200).json({
      message: 'Users retrieved successfully!',
      results : data.codeContent
    })
  })
})

module.exports = router
