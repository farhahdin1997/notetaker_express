const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid')

const app = express();
const PORT = process.env.PORT || 80

// reads db.json and sets the data string to a variable
let currentNotesRaw;
function readDatabase() {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    currentNotesRaw = data;
  })
}
readDatabase()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// loads notes.html
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// brings in the database
app.get("/api/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/db/db.json"))
);

//save note
app.post("/api/notes", (req, res) => {
  const currentNotes = JSON.parse(currentNotesRaw);
  req.body.id = uuidv4() // add a unique id
  currentNotes.push(req.body);
  fs.writeFile('./db/db.json', JSON.stringify(currentNotes), err =>
  err
  ? console.error(err)
  : console.log(
      `New note - ${req.body.title} - has been added to the database`
    )
  )
  res.send(req.body)
  readDatabase()
});

// delete note
app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params
  let currentNotes = JSON.parse(currentNotesRaw)
  currentNotes = currentNotes.filter(note => note.id !== id)
  fs.writeFile('./db/db.json', JSON.stringify(currentNotes), err =>
  err
  ? console.error(err)
  : console.log(
      `Note has been deleted`
    )
  )
  res.send(id)
  readDatabase()
})

// all other routes return to the homepage
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () =>
  console.log(`Serving static asset routes on port ${PORT}!`)
);