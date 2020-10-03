var express = require("express");
const fs = require("fs");
const path = require("path");
// generate ids
const { v4: uuidv4 } = require("uuid");
// creates an "express" instance
var app = express();
// Sets an initial port and allows heroku
var PORT = process.env.PORT || 3001;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// css connect
app.use(express.static("public"));

// Api routes
  // GET  api

app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
      if (err) throw err;
      const updatedData = JSON.parse(data);
      res.json(updatedData);
    });
});

  // POST 

app.post("/api/notes", (req, res) => {
    // id
    req.body.id = uuidv4();
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
      if (err) throw err;
      const updatedData = JSON.parse(data);
      updatedData.push(req.body);
      // write it to html file
      fs.writeFile(
        "./db/db.json",
        JSON.stringify(updatedData, null, "\t"),
        (err) => {
          if (err) throw err;
          res.sendFile(path.join(__dirname, "./public/notes.html"));
        }
      );
    });
});
  // DELETE 
app.delete("/api/notes/:id", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
      if (err) throw err;
      const updatedData = JSON.parse(data);
      const filteredNotes = updatedData.filter(
        (note) => req.params.id !== note.id
      );
      // write to database 
      fs.writeFile(
        "./db/db.json",
        JSON.stringify(filteredNotes, null, 2),
        (err) => {
          if (err) throw err;
          res.sendFile(path.join(__dirname, "./public/notes.html"));
        }
      );
    });
});
//HTML ROUTE for notes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//HTML ROUTE for core
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// LISTENER



app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});