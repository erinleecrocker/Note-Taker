const express = require("express");
const fs = require("fs");
const uuid = require("uuid");
//build instance 
const app = express();
// add a port
const PORT = process.env.PORT || 8080;
const { v4: uuidv4 } = require("uuid");

// add middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("./public"));
// add routes
// get notes page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
// get index
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
  });
// get api
app.get("/api/notes", (req,res) => {
    fs.readFile("./db/db.json", "utf-8", (err,data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                error: true,
                data: null,
                message: "Unable to retrieve notes.",
            });
        }
        res.json({
            error: false,
            data: JSON.parse(data),
            message: "Sucessfully retrived notes",
        });
    });
});

// post 
app.post("/api/notes", (req,res) => {
    req.body.id = uuidv4();
    if(!req.body.title || !req.body.text){
        res.status(400).jason({
            error: true,
            data: null,
            message: "Invalid note. Please reformat and try again.",
        });
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
        if(err) {
            console.log(err);
            return res.json({
                error: true,
                data: null,
                message: "Unable to retrieve notes."
            });
        }
        console.log(data);
        const newNote = JSON.parse(data);
        newNote.push(req.body);
        console.log(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(newNote),(err) => {
            res.sendFile(path.join(__dirname, "./public/notes.html"));
            if (err) throw err;
            res.json({
                error: true,
                data: null,
                message: "Sucessfully added new note.",
            });
        });
    });
};
// delete
app.delete("/api/notes/:id", (req, res) => {
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
      if (err) throw err;
        const updatedData = JSON.parse(data);
        const filteredNotes = updatedData.filter(
            (note) => req.params.id !== note.id
      );
      fs.writeFile("./db/db.json", JSON.stringify(filteredNotes, null, 2), (err) => {
          if (err) throw err;
          res.sendFile(path.join(__dirname, "./public/notes.html"));
        }
      );
    });
  });
});

app.listen(PORT, () =>{
    console.log(`app is running on http://localhost:${PORT}`);
})