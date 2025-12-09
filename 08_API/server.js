const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// JSON body support
app.use(express.json());

// set Static client for html pages/js/css
app.use(express.static(path.join(__dirname, "client")));


// ---- START SERVER ----
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

//04)

// ---- SIMPLE HOME ROUTE (ONE PAGE) ----
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"));
});

// ---- SIMPLE HOME ROUTE (ONE PAGE) ----
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"));
});

// ---- SIMPLE HOME ROUTE (ONE PAGE) ----
app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "index.html"));
});


// 06)GET ALL SONGS
app.get("/api/songs", (req, res) => {
    const songs = readSongs();
    res.json(songs);
});
//--06--

//7) GET SONG BY ID
app.get("/api/songs/:id", (req, res) => {
    const songs = readSongs();
    const id = parseInt(req.params.id);
    const song = songs.find(s => s.id === id);

    if (!song) return res.status(404).json({ error: "Song not found" });
    res.json(song);
});
//--07--

// 08) QUERYSTRING DEMO: /api/search?artist=Metallica&minYear=1990
app.get("/api/search", (req, res) => {
    const { artist, minYear, maxYear } = req.query;
    let songs = readSongs();

    if (artist) {
        songs = songs.filter(s =>
            s.artist.toLowerCase().includes(artist.toLowerCase())
        );
    }

    if (minYear) {
        songs = songs.filter(s => s.year >= parseInt(minYear));
    }

    if (maxYear) {
        songs = songs.filter(s => s.year <= parseInt(maxYear));
    }

    res.json(songs);
});
//--08--

const DATA_FILE = path.join(__dirname, "data", "songs.json");

function readSongs() {
    try {
        const data = fs.readFileSync(DATA_FILE, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading songs.json:", err.message);
        return [];
    }
}


function writeSongs(songs) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(songs, null, 2));
}




//09) CREATE (POST):
/* replaced by below with upload
app.post("/api/songs", (req, res) => {
    const songs = readSongs();
    const { title, artist, year } = req.body;
    // basic validation
    if (!title || !artist || !year) {
        return res.status(400).json({ error: "Missing fields" });
    }
    // create new song object
    const newSong = {
        id: songs.length ? Math.max(...songs.map(s => s.id)) + 1 : 1,
        title,
        artist,
        year: parseInt(year),
        mp3: null   // will use later when we add upload
    };

    songs.push(newSong);
    writeSongs(songs);
    res.status(201).json(newSong);
});*/
//--09--


//10 UPDATE (PUT):
app.put("/api/songs/:id", (req, res) => {
    const songs = readSongs();
    const id = parseInt(req.params.id);
    const { title, artist, year } = req.body;

    const index = songs.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ error: "Song not found" });

    songs[index].title = title ?? songs[index].title;
    songs[index].artist = artist ?? songs[index].artist;
    songs[index].year = year ? parseInt(year) : songs[index].year;

    writeSongs(songs);

    res.json(songs[index]);
});

//11) Delete:
app.delete("/api/songs/:id", (req, res) => {
    const songs = readSongs();
    const id = parseInt(req.params.id);

    const index = songs.findIndex(s => s.id === id);
    if (index === -1) return res.status(404).json({ error: "Song not found" });

    const deleted = songs.splice(index, 1)[0];
    writeSongs(songs);

    res.json({ message: "Deleted", song: deleted });
});

const multer = require("multer");
//-------------------------------------------------
app.use("/mp3", express.static(path.join(__dirname, "uploads")));

//-------------------------------------------------
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

//----------------------------------------------------

//  CREATE (POST) + MP3 UPLOAD
app.post("/api/songs", upload.single("file"), (req, res) => {
    const songs = readSongs();
    const { title, artist, year } = req.body;

    if (!title || !artist || !year) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const newSong = {
        id: songs.length ? Math.max(...songs.map(s => s.id)) + 1 : 1,
        title,
        artist,
        year: parseInt(year),
        mp3: req.file ? "/mp3/" + req.file.filename : null
    };

    songs.push(newSong);
    writeSongs(songs);

    res.status(201).json(newSong);
});
