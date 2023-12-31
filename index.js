const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

//Acessing enviroment variables
const mongoURI = process.env.DATABASE_URI;
const secretKey = process.env.SECRET_KEY;

//using the secretKey
const mySecret= secretKey

const app = express();
const port = process.env.PORT || 4000; // Changed the default port

// Define the MongoDB connection URI with the database name
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
    required: true,//Name is a required field
  },
  age: {
    type: Number,
  },
  email: {
    type: String,
    required: true, // Email is now a required field
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // validating the email using regex(regular expression)
  },
  password: {
    type: String,
    required: true, // Password is now a required field
    match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,

  },
  present: {
    type: Boolean,
    default: true,
  }
});


// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const student = mongoose.model('Student', studentSchema);

// GET operator (get a list of students from the database)
app.get('/students', function (req, res, next) {
  student.find({})
    .then(function (students) {
      res.send(students);
    })
    .catch(next);
});

app.post('/students', function (req, res, next) {
  // Ensure that the "name" field is provided
  if (!req.body.name) {
    //console.log(res.body.name);
    return res.status(400).json({ error: 'Name is required' });
  }

  // Create a new student document based on the request body
  student.create(req.body)
    .then(function (student) {
      res.status(201).send(student); // Send a 201 Created response with the created student
    })
    .catch(function (error) {
      if (error.name === 'ValidationError') {
        res.status(400).json({ error: error.message }); // Handle validation errors
      } else {
        next(error); // Pass other errors to the error handling middleware
      }
    });
});


app.put('/students/:id', function (req, res, next) {
  student.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }) // Use { new: true } to return the updated document
    .then(function (updatedStudent) {
      res.send(updatedStudent);
    })
    .catch(next);
});




// DELETE OPERATOR (delete a student from the database)
app.delete('/students/:id', function (req, res, next) {
  student.findOneAndDelete({ _id: req.params.id })
    .then(function (student) {
      res.send(student);
    });
});



//listening port for the APIs
app.listen(port || 4000, function(){
  console.log("Ready to Go");
});

app.get('/', (req, res) =>{
  res.send("welcome to studentApI ")
});