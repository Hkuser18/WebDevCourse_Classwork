let song1 = {
    "title": "Shape of You",
    "artist": "Ed Sheeran",
    "duration": 233,
    "genre": "Pop"
}

let song2 = Object.assign({}, song1);
let { title, duration } = song2;

for (let key in song2) {
    console.log(`${key}: ${song2[key]}`);
}  