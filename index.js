const port = 3004;
const express = require('express');
const app = express();

//Route for Home Page
app.get('/', (req, res) => {
    res.send(`
      <h1>G00418330</h1>
      <ul>
        <li><a href="/students">Students Page</a></li>
        <li><a href="/grades">Grades Page</a></li>
        <li><a href="/lecturers">Lecturers Page</a></li>
      </ul>
    `);
  });

  //Route for Students Page
app.get('/students', (req, res) => {
    res.send('<h1>Students Page</h1>');
  });
  
  //Route for Grades Page
  app.get('/grades', (req, res) => {
    res.send('<h1>Grades Page</h1>');
  });
  
  //Route for Lecturers Page
  app.get('/lecturers', (req, res) => {
    res.send('<h1>Lecturers Page</h1>');
  });
  
  //Start the server
  app.listen(port, () => {
    console.log(`Web app running on http://localhost:${port}`);
  });