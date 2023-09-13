const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Define the MongoDB connection URI and options
const mongoURI = 'mongodb://localhost:27017/yourdb'; // Replace with your actual MongoDB URI
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to the MongoDB database
mongoose.connect(mongoURI, mongooseOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Define the Mongoose schema for the "student" collection
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  roll: {
    type: Number,
    required: true,
  },
    present:{
        type: Boolean,
        default :true
    }
});
    module.exports = student;






