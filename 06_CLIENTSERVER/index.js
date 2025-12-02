const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.use(express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'home.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'about.html'));
});


// Sample songs data
const songs = [
    {
        id: 1,
        title: "Blinding Lights",
        artist: "The Weeknd",
        duration: "3:20"
    },
    {
        id: 2,
        title: "Levitating",
        artist: "Dua Lipa",
        duration: "3:23"
    },
    {
        id: 3,
        title: "Save Your Tears",
        artist: "The Weeknd",
        duration: "3:35"
    }
];

// Endpoint to return the songs data in JSON format
app.get('/songs', (req, res) => {
    res.json(songs);  // Send JSON response
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
