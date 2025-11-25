//-- GEt HTML DOM element references
const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');

//-- if not exist in localStorage, initialize empty array, else parse existing data
let songs = JSON.parse(localStorage.getItem('playlist')) || [];

//User clicks the Add Button
form.addEventListener('submit', (e) => {
    //dont submit the form yet, let me handle it
    e.preventDefault();

    //read forms data
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;

    //TODO - validate data

    //create JSON song object, based on url and title
    const song = {
        id: Date.now(),  // Unique ID
        title: title,
        url: url,
        dateAdded: Date.now()
    };


    songs.push(song);

    saveAndRender();
    form.reset();
});

//save to localStorage
function saveAndRender() {

    localStorage.setItem('playlist', JSON.stringify(songs));

    //TODO - reload ui

    renderSongs();

}

//render songs to the table
function renderSongs() {
    list.innerHTML = ''; // Clear current list

    songs.forEach(song => {
        // Create table row
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${song.title}</td>
            <td><a href="${song.url}" target="_blank" class="text-info">Watch</a></td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        list.appendChild(row);
    });
}
