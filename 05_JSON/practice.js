let song1 = {
    "title": "Shape of You",
    "artist": "Ed Sheeran",
    "duration": 233,
    "genre": "Pop"
}

let playlist = {
    "playlistName": "My Favorites",
    "creeated By": "User123",
    "songs": {
        "title": "Shape of You",
        "artist": "Ed Sheeran",
        "duration": 233,
        "genre": "Pop"
    },
    "totalDuration": 233
}

let song2 = Object.assign({}, song1);
let { title, duration } = song2;

for (let key in song2) {
    console.log(`${key}: ${song2[key]}`);
}

let addSong = {
    "title": "Blinding Lights",
    "artist": "The Weeknd",
    "duration": 200,
    "genre": "Synthwave"
};
playlist.songs.push(addSong);

playlist.songs.forEach(song => {
    console.log(`Title: ${song.title}, Artist: ${song.artist}`);
});


const jsonString = '{"playlistName":"Top Hits","songs":[{"title":"Shape of You","artist":"Ed Sheeran"}]}';
const playlistObj = JSON.parse(jsonString);
console.log(playlistObj.songs[0].title); // Shape of You

const jsonText = JSON.stringify(playlist);

let playlist2 = JSON.parse(jsonText);

localStorage.setItem("myPlaylist", jsonText);
let storageText = localStorage.getItem("myPlaylist");
let playlist3 = JSON.parse(storageText);    