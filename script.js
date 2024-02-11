const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

async function searchSongs(term) {
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();

    showData(data);
}
function showData(data) {

    result.innerHTML =  `
        <ul class="songs">
            ${data.data.map(song => `
            <li>
                <div class="cover-img">
                    <img src="${song.album.cover}" alt="cover">
                </div>

                <div class="song-title">
                    <span><strong>${song.artist.name}</strong> - ${song.title}</span>
                </div>


                <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>

            </li>
        ` )
        .join('')}
        </ul>
    `;
    if(data.prev || data.next) {
        more.innerHTML = `
            ${data.prev ? `<button class='btn' onClick="getMoreSongs('${data.prev}')">Prev</button>` : '' }
            ${data.next ? `<button class='btn' onClick="getMoreSongs('${data.next}')">Next</button>` : '' }
        `
    }

    else {
        more.innerHTML = '';
    }
}

// Get prev and next songs
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`); 
    const data = await res.json();

    showData(data);
}

// Get lyrics of the song
async function getLyrics(artist, songTitle) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    if (lyrics == '') {
        result.innerHTML = `
        <h2><strong>${artist}</strong> - ${songTitle}</h2>
        <h3 class="no-lyrics">Lyrics Not Available. Sorry ☹ </h3>`;
    } 
    else {
        result.innerHTML = `
            <h2><strong>${artist}</strong> - ${songTitle}</h2>
            <span>${lyrics}</span>
        `;
    }
    more.innerHTML = '';
}

// Event Listners
form.addEventListener('submit', e => {
    e.preventDefault();

    const searchTerm = search.value.trim();

    if (!searchTerm) {
        alert('Type Something');
    }

    else {
        searchSongs(searchTerm);
    }
})


// Get Lyrics event listner
result.addEventListener('click', e => {
    const clickedEl = e.target;

    if (clickedEl.tagName === 'BUTTON') {
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songtitle');

        getLyrics(artist, songTitle);
    }
})
