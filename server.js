const { v4: uuidv4 } = require('uuid');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const fs = require('fs');

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './notes.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile('./develop/db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.post('/api/notes', (req, res) => {
  fs.readFile('./develop/db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    let newNote = req.body;
    newNote.id = uuidv4(); // Assign a unique id to the note
    notes.push(newNote);
    fs.writeFile('./develop/db/db.json', JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './notes.html'));
  });

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./develop/db/db.json', 'utf8', (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes = notes.filter(note => note.id != req.params.id);
    fs.writeFile('./develop/db/db.json', JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json({ message: `Note with id ${req.params.id} deleted` });
    });
  });
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});