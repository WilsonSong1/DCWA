const port = 3004;
const express = require('express');
const app = express();
let ejs = require('ejs')
const mongoose = require('mongoose');
var bodyParser = require('body-parser')

app.set('view engine', 'ejs')
//Middleware to parse JSON request bodies
app.use(express.json());
//Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

var pmysql = require('promise-mysql')
var pool

//Connecting to pool and promise to mysql
pmysql.createPool({
    connectionLimit : 3,
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'proj2024mysql'
    })
    .then((p) => {
       pool = p
    })
    .catch((e) => {
        console.log("pool error:" + e)
  })

//Connecting to MongoDB
mongoose.connect('mongodb://localhost:27017/proj2024MongoDB', {
})

//Route for Home Page
app.get('/', (req, res) => {
    res.render('mainPage');
  });

  //Route for Students Page
app.get('/students', async(req, res) => {
  const students = await pool.query("select * from student order by sid")

  res.render('students', {students});
  });
  
  //Route for Grades Page
  app.get('/grades', (req, res) => {
    res.render('grades');
  });
  
  //Route for Lecturers Page
  app.get("/lecturers", async(req, res) => {
        res.render("lecturers");
});

app.get('/students/edit/:sid', async(req, res) =>{
  const sid = req.params.sid;

  //MySQL Query to find a specific student by their ID
  const students = await pool.query("select * from student where sid =?", [sid]);

  //Display it in updateStudent
  res.render('updateStudent', {students: students[0], errorMessage: []});
})

app.post('/students/edit/:sid', async(req, res) =>{
  const {sid, name, age} = req.body;
  const errorMessage =[];

  //Checking if the name has at least 2 characters
  if(name == undefined || name.length <= 2){
    errorMessage.push('Student name should be at least 2 or more characters');
  }
  //Checking if age is at least 18
  if(age == undefined || age <= 18){
    errorMessage.push('Student age must be at least 18');
  }

  //If there is an error message display it to the user
  if(errorMessage.length > 0){
    return res.render('updateStudent', {
      students: {sid, name, age},
      errorMessage
    });
  }

  //Updating the database with the new changes
  await pool.query('update student set name = ?, age = ? where sid = ?', [name, age, sid]);

  res.redirect('/students');
});

app.get('/students/add', (req, res) => {
  res.render('addStudent', { errorMessage: [], studentInfo: {} });
});

app.post('/students/add', async (req, res) => {
  const { sid, name, age } = req.body;
  const errorMessage = [];
  const studentInfo = { sid, name, age };
  
  //Checking if ID has at least 4 characters
  if (sid == undefined || sid.length !== 4) {
    errorMessage.push("Student ID should have at least 4 characters");
  }
  //Checking if name has at least 2 characters
  if (name == undefined || name.length < 2) {
    errorMessage.push("Student Name should have at least 2 characters");
  }
  //Checking if age is at least 18
  if (age == undefined || age < 18) {
    errorMessage.push("Age should be at least 18");
  }

  //If errorMessage is more than 0 an error message is displayed
  if (errorMessage.length > 0) {
    return res.render('addStudent', { errorMessage, studentInfo });
  }

  //check is given the ID the user has chose if it exists in the database
  const check = await pool.query('SELECT * FROM student WHERE sid = ?', [sid]);

  //If check is assigned an ID, ID is already taken, error message is displayed
  if (check.length > 0) {
    errorMessage.push("Student ID already exists please try another ID");
    return res.render('addStudent', { errorMessage, studentInfo });
  }

  //Adding the new student information into the database
  await pool.query('INSERT INTO student (sid, name, age) VALUES (?, ?, ?)', [sid, name, age]);

  //Redirect back to students
  res.redirect('/students');
});


  //Start the server
  app.listen(port, () => {
    console.log(`Web app running on http://localhost:${port}`);
  });