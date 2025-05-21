const express = require('express');
const mysql = require('mysql2'); 
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//  MySQL Connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Raj@12345678',
  database: 'todo' 
});

connection.connect((err) => {
  if (err) {
    console.log("Connection error:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

//  Home route - task count
app.get("/", (req, res) => {
  const q = `SELECT COUNT(*) AS taskcount FROM tasks`;

  connection.query(q, (err, results) => {
    if (err) return res.send("Error fetching task count");

    const taskcount = results[0].taskcount;
    res.render("home", { taskcount });
  });
});

//  Show all tasks
app.get("/task", (req, res) => {
  const q = `SELECT * FROM tasks`;

  connection.query(q, (err, results) => {
    if (err) return res.send("Error fetching tasks");

    res.render("tasklist", { tasks: results });
  });
});

//  Add new task
app.post("/task", (req, res) => {
  const { title } = req.body;
  const q = `INSERT INTO tasks (title, status) VALUES (?, 'pending')`;

  connection.query(q, [title], (err) => {
    if (err) return res.send("Error adding task");
    res.redirect("/task");
  });
});

//  Delete task
app.post("/task/delete/:id", (req, res) => {
  const { id } = req.params;
  const q = `DELETE FROM tasks WHERE id = ?`;

  connection.query(q, [id], (err) => {
    if (err) return res.send("Error deleting task");
    res.redirect("/task");
  });
});

//  Mark task as complete
app.post("/task/complete/:id", (req, res) => {
  const { id } = req.params;
  const q = `UPDATE tasks SET status = 'done' WHERE id = ?`;

  connection.query(q, [id], (err) => {
    if (err) return res.send("Error updating task");
    res.redirect("/task");
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
