

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
    //Check if in Edit Mode
    if (id) {
        // --- UPDATE MODE ---
        const index = songs.findIndex(s => s.id == id);
        songs[index].title = title;
        songs[index].url = url;
        songs[index].rating = Number(rating);
        songs[index].vidId = url.split('=')[1].slice(0, 11); // Update Video ID
        // Reset Button
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
        submitBtn.classList.replace('btn-warning', 'btn-success');
        document.getElementById('songId').value = '';
    } else {
        // --- ADD MODE ---
        const vidId = url.split('=')[1].slice(0, 11); // Extract Video ID from URL
        //const vidTitle =
        const song = {
            id: Date.now(), //Unique ID based on timestamp
            title: title,
            url: url,
            rating: Number(rating),
            dateAdded: Date.now(),
            vidId: vidId
        };
        songs.push(song);
    }

    saveAndRender();
    form.reset();
});

//handler for radio button change to sort songs
function handleRadioChange() {
    const selectedRadio = document.querySelector('input[name="radioSort"]:checked'); // Get the selected radio button

    if (selectedRadio) {
        const selectedId = selectedRadio.id;
        console.log("Selected radio button:", selectedId);

        // Perform actions based on which radio button is selected
        switch (selectedId) {
            case 'radioName1':
                console.log("Sorting by Name");
                sortSongs('name');
                break;
            case 'radioAdd1':
                console.log("Sorting by Last Added");
                sortSongs('dateAdded');
                break;
            case 'radioRate1':
                console.log("Sorting by Rating");
                sortSongs('rating');
                break;
            default:
                console.log("No valid option selected");
        }
    }
}

// Attach the event listener to the radio buttons
const radioButtons = document.querySelectorAll('input[name="radioSort"]');
radioButtons.forEach(radio => {
    radio.addEventListener('change', handleRadioChange);
});

function sortSongs(method) {
    switch (method) {
        case 'name':
            songs.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'dateAdded':
            songs.sort((a, b) => b.dateAdded - a.dateAdded);
            break;
        case 'rating':
            songs.sort((a, b) => b.rating - a.rating);
            break;
        default:
            console.log("No valid sorting method provided");
    }
    renderSongs();
}


//Save to Local storage and  render UI Table
function saveAndRender() {

    localStorage.setItem('songs', JSON.stringify(songs));
    //TODO RELOAD UI 
    handleRadioChange();
}

//Change View Button Handler switch between Table and Card View
function changeView() {
    const changeViewBtn = document.getElementById('changeView');
    const tableHeader = document.getElementById('tableHeader');
    
    // Toggle Button Icon and View - list icon means currently in Card View, switch to Table View
    if (changeViewBtn.innerHTML.includes('fa-list')) 
    {
        // Switch to Table View
        changeViewBtn.innerHTML = '<i class="fa fa-cogs"></i>';
        tableHeader.classList.add('show');
        renderSongs();
    }
    else { 
        // Switch to Card View
        changeViewBtn.innerHTML = '<i class="fa fa-list"></i>';
        tableHeader.classList.remove('show');
        renderSongs();
    }
}


//Display Song From Current Updated songs array as tale Rows 
function renderSongs() {
    list.innerHTML = ''; // Clear current list 
    const changeViewBtn = document.getElementById('changeView');
    if (!changeViewBtn.innerHTML.includes('fa-list')) 
    {
    songs.forEach(song => {
        // Create table row
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><a href="#" class="text-info" onclick="openPlayer(${song.id}); return false;">${song.title}</a></td>
            <td><img src="https://img.youtube.com/vi/${song.vidId}/maxresdefault.jpg" alt="${song.title}" class="img-thumbnail" style="max-width: 250px;"></td>
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
    else {
        // Build a responsive grid: 2 per row on md, 3 per row on lg+
        const grid = document.createElement('div');
        grid.classList.add('row', 'g-3', 'mx-0');

        songs.forEach(song => {
            const col = document.createElement('div');
            col.classList.add('col-12', 'col-md-6', 'col-lg-4');

            const card = document.createElement('div');
            card.classList.add('card', 'h-100');

            card.innerHTML = `
                <img src="https://img.youtube.com/vi/${song.vidId}/maxresdefault.jpg" class="card-img-top" alt="${song.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title"><a href="#" class="text-info" onclick="openPlayer(${song.id}); return false;">${song.title}</a></h5>
                    <p class="card-text mb-3">Rating: ${song.rating}</p>
                    <div class="mt-auto text-end">
                        <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;

            col.appendChild(card);
            grid.appendChild(col);
        });

        list.appendChild(grid);
    }
}

//Delete Song by ID
function deleteSong(id) {
    if (confirm('Are you sure?')) {
        // Filter out the song with the matching ID
        songs = songs.filter(song => song.id !== id);
        saveAndRender();
    }
}

//Edit Song by ID
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

//Update Song in songs array
function updateSong(id, title, url, rating) {

    const index = songs.findIndex(song => song.id == id);


    songs[index].title = title;
    songs[index].url = url;
    songs[index].rating = Number(rating);



    document.getElementById('songId').value = '';
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
    submitBtn.classList.replace('btn-warning', 'btn-success');
}

// Open YouTube player in a Bootstrap modal
function openPlayer(id) {
    const song = songs.find(s => s.id === id);
    if (!song) return;

    const embedUrl = `https://www.youtube.com/embed/${song.vidId}?autoplay=1`;
    const frame = document.getElementById('playerFrame');
    const titleEl = document.getElementById('playerTitle');
    frame.src = embedUrl;
    titleEl.textContent = song.title;

    const modalEl = document.getElementById('playerModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    // Clear src when modal hides to stop playback
    modalEl.addEventListener('hidden.bs.modal', () => {
        frame.src = '';
    }, { once: true });
}