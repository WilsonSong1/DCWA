const port = 3004;
const express = require('express');
const app = express();
let ejs = require('ejs')
const mongoose = require('mongoose');

app.set('view engine', 'ejs')

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

app.get("/students/update/:sid", async(req,res)=>{

});
  
  //Start the server
  app.listen(port, () => {
    console.log(`Web app running on http://localhost:${port}`);
  });