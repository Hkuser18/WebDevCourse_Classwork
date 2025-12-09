
// 13 - initialization
const songsTableBody = document.querySelector("#songsTable tbody");
const songForm = document.getElementById("songForm");
const songIdInput = document.getElementById("songId");
const titleInput = document.getElementById("title");
const artistInput = document.getElementById("artist");
const yearInput = document.getElementById("year");
const fileInput = document.getElementById("file");

const cancelEditBtn = document.getElementById("cancelEditBtn");
const searchBtn = document.getElementById("searchBtn");
const searchArtistInput = document.getElementById("searchArtist");
const searchMinYearInput = document.getElementById("searchMinYear");
const searchMaxYearInput = document.getElementById("searchMaxYear");

let isEditing = false;
//--13--

//14- load songs
async function loadSongs() {
    const res = await fetch("/api/songs");
    const songs = await res.json();
    renderSongs(songs);
}

function renderSongs(songs) {
    songsTableBody.innerHTML = "";

    songs.forEach(song => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${song.id}</td>
            <td>${song.title}</td>
            <td>${song.artist}</td>
            <td>${song.year}</td>
            <td>
                ${song.mp3 ? `<audio controls src="${song.mp3}"></audio>` : `<span class="text-muted">No file</span>`}
            </td>
            <td>
                <button class="btn btn-sm btn-warning me-2" data-action="edit" data-id="${song.id}">Edit</button>
                <button class="btn btn-sm btn-danger" data-action="delete" data-id="${song.id}">Delete</button>
            </td>
        `;

        songsTableBody.appendChild(tr);
    });
}

loadSongs();
//14B search w querystring
searchBtn.addEventListener("click", async () => {
    const artist = searchArtistInput.value;
    const minYear = searchMinYearInput.value;
    const maxYear = searchMaxYearInput.value;

    const params = new URLSearchParams();
    if (artist) params.append("artist", artist);
    if (minYear) params.append("minYear", minYear);
    if (maxYear) params.append("maxYear", maxYear);

    const url = `/api/search?${params.toString()}`;
    console.log("Calling:", url); // good for teaching

    const res = await fetch(url);
    const songs = await res.json();
    renderSongs(songs);
});

//15) FORM SUBMIt

function clearForm() {
    isEditing = false;
    songIdInput.value = "";
    titleInput.value = "";
    artistInput.value = "";
    yearInput.value = "";
    fileInput.value = ""; // will matter later
}

// ---------- EDIT / DELETE BUTTONS ----------

songsTableBody.addEventListener("click", async (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const id = btn.getAttribute("data-id");
    const action = btn.getAttribute("data-action");

    if (action === "edit") {
        const res = await fetch(`/api/songs/${id}`);
        if (!res.ok) {
            alert("Song not found");
            return;
        }
        const song = await res.json();
        isEditing = true;
        songIdInput.value = song.id;
        titleInput.value = song.title;
        artistInput.value = song.artist;
        yearInput.value = song.year;
        fileInput.value = ""; // we don't re-upload here
    }

    if (action === "delete") {
        if (!confirm("Delete this song?")) return;
        const res = await fetch(`/api/songs/${id}`, { method: "DELETE" });
        if (!res.ok) {
            alert("Error deleting song");
            return;
        }
        loadSongs();
    }
});

cancelEditBtn.addEventListener("click", () => {
    clearForm();
});

songForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!isEditing) {
        // CREATE with file upload
        const formData = new FormData();
        formData.append("title", titleInput.value);
        formData.append("artist", artistInput.value);
        formData.append("year", yearInput.value);

        if (fileInput.files[0]) {
            formData.append("file", fileInput.files[0]); // field name "file" matches upload.single("file")
        }

        const res = await fetch("/api/songs", {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            alert("Error creating song (upload)");
        }
    } else {
        // UPDATE (metadata only, NO new file)
        const id = songIdInput.value;
        const songData = {
            title: titleInput.value,
            artist: artistInput.value,
            year: yearInput.value
        };

        const res = await fetch(`/api/songs/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(songData)
        });
        if (!res.ok) {
            alert("Error updating song");
        }
    }

    clearForm();
    loadSongs();
});
