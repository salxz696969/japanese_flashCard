const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

let rememberList = []; // Placeholder for the remember list data

app.use(cors()); // Allow cross-origin requests from your React frontend
app.use(express.json()); // Parse incoming JSON requests

// Serve lesson data
app.get("/lessons/:lessonId", (req, res) => {
  const lessonId = req.params.lessonId;
  try {
    const lessonData = require(`./data/${lessonId}.json`); // Dynamically load the lesson JSON
    res.json(lessonData);
  } catch (error) {
    res.status(404).json({ message: "Lesson not found!" });
  }
});

// Get the remember list
app.get("/remember", (req, res) => {
  res.json(rememberList);
});

// Add a word to the remember list
app.post("/remember", (req, res) => {
  const word = req.body;
  rememberList.push(word); // Add the word to the in-memory list
  res.json({ message: "Word added to remember list", word });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});