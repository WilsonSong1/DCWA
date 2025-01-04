const port = 3004;
const express = require('express');
const app = express();
let ejs = require('ejs')

app.set('view engine', 'ejs')

//Route for Home Page
app.get('/', (req, res) => {
    res.render('mainPage');
  });

  //Route for Students Page
app.get('/students', (req, res) => {
    res.render('students');
  });
  
  //Route for Grades Page
  app.get('/grades', (req, res) => {
    res.render('grades');
  });
  
  //Route for Lecturers Page
  app.get("/lecturers", async (req, res) => {
        res.render("lecturers");
});
  
  //Start the server
  app.listen(port, () => {
    console.log(`Web app running on http://localhost:${port}`);
  });