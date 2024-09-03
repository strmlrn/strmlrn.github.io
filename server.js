const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Connect to SQLite database
let db = new sqlite3.Database('./questions_database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the questions_database database.');
});

// Enable CORS for all routes
app.use(cors({
  origin: '*'  // Allow all origins
}));

// Search API endpoint
app.get('/api/search', (req, res) => {
  let query = req.query.q;
  let sql = `SELECT id, question_number, question_type, year, question_text, 
             image_available, video_solution_available, answer 
             FROM questions 
             WHERE question_text LIKE ? 
             OR category LIKE ? 
             OR year LIKE ?
             OR id LIKE ? 
             OR question_number LIKE ?
             OR question_type LIKE ? 
             OR video_solution_available LIKE ?
             OR image_available LIKE ?`;
  let params = Array(8).fill(`%${query}%`);

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});