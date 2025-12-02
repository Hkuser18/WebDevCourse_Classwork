

//--Get HTML DOM Element References 
const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');


// This runs automatically when the page finishes loading
document.addEventListener('DOMContentLoaded', () => {

    //1) Get From Local Storage
    const storedData = localStorage.getItem('songs');
    //02) if exsist
    if (storedData) {
        // If yes, turn the JSON string back into an Array
        songs = JSON.parse(storedData);
    } else {
        // If no, start with an empty array
        songs = [];
    }

    // SHOW the data
    renderSongs(songs);
});





//User Click the Add Button
form.addEventListener('submit', (e) => {
    //Dont submit the for to the server yey let me handle it here
    e.preventDefault();

    //Read Forms Data
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const rating = document.getElementById('rating').value;
    const id = document.getElementById('songId').value; // Hidden field for Edit mode
    if (rating < 1 || rating > 10) {
        document.getElementById('rating').classList.add('is-invalid');
        return;
    } else {
        document.getElementById('rating').classList.remove('is-invalid');
    }

    if (id) {
        // --- UPDATE MODE ---
        const index = songs.findIndex(s => s.id == id);
        songs[index].title = title;
        songs[index].url = url;
        songs[index].rating = Number(rating);
        // Reset Button
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
        submitBtn.classList.replace('btn-warning', 'btn-success');
        document.getElementById('songId').value = '';
    } else {
        // --- ADD MODE ---
        const song = {
            id: Date.now(), //Unique ID based on timestamp
            title: title,
            url: url,
            rating: Number(rating),
            dateAdded: Date.now()
        };
        songs.push(song);
    }

    saveAndRender();
    form.reset();
});

//Save to Local storage and  render UI Table
function saveAndRender() {

    localStorage.setItem('songs', JSON.stringify(songs));
    //TODO RELOAD UI 
    renderSongs();
}


//Display Song From Current Updated songs array as tale Rows 
function renderSongs() {
    list.innerHTML = ''; // Clear current list

    songs.forEach(song => {
        // Create table row
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${song.title}</td>
            <td><a href="${song.url}" target="_blank" class="text-info">Watch</a></td>
            <td>${song.rating}</td>
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

function deleteSong(id) {
    if (confirm('Are you sure?')) {
        // Filter out the song with the matching ID
        songs = songs.filter(song => song.id !== id);
        saveAndRender();
    }
}

function editSong(id) {

    const songToEdit = songs.find(song => song.id === id);


    document.getElementById('title').value = songToEdit.title;
    document.getElementById('url').value = songToEdit.url;
    document.getElementById('songId').value = songToEdit.id; // Set Hidden ID
    document.getElementById('rating').value = songToEdit.rating;

    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update';
    submitBtn.classList.replace('btn-success', 'btn-warning');
    // Change Form Submit Behavior



}

function updateSong(id, title, url, rating) {

    const index = songs.findIndex(song => song.id == id);


    songs[index].title = title;
    songs[index].url = url;
    songs[index].rating = Number(rating);



    document.getElementById('songId').value = '';
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
    submitBtn.classList.replace('btn-warning', 'btn-success');
}