// static/script.js

document.addEventListener('DOMContentLoaded', function() {
    const workTypeSelect = document.getElementById('work_type');
    const fictionFields = document.getElementById('fiction_fields');
    const nonfictionFields = document.getElementById('nonfiction_fields');

    const genreSelect = document.getElementById('genre');
    const subgenreDiv = document.getElementById('subgenre_div');

    const subgenresData = {
        'Fantasy': ['High Fantasy', 'Urban Fantasy', 'Dark Fantasy', 'Epic Fantasy', 'Magical Realism'],
        'Science Fiction': ['Cyberpunk', 'Space Opera', 'Time Travel', 'Dystopian', 'Post-Apocalyptic'],
        'Mystery': ['Detective', 'Cozy Mystery', 'Noir', 'Crime Thriller', 'Whodunit'],
        'Romance': ['Contemporary Romance', 'Historical Romance', 'Paranormal Romance'],
        'Horror': ['Supernatural Horror', 'Psychological Horror', 'Gothic Horror'],
        'Historical Fiction': ['Historical Romance', 'Alternate History'],
        'Literary Fiction': ['Contemporary Fiction', 'Experimental Fiction'],
        'Adventure': ['Action-Adventure', 'Survival Stories'],
    };

    function disableFields(container, disable) {
        const elements = container.querySelectorAll('input, select, textarea');
        elements.forEach(function(element) {
            element.disabled = disable;
        });
    }

    // Initial disabling of fields
    disableFields(fictionFields, true);
    disableFields(nonfictionFields, true);

    workTypeSelect.addEventListener('change', function() {
        if (this.value === 'Fiction') {
            fictionFields.style.display = 'block';
            nonfictionFields.style.display = 'none';
            disableFields(fictionFields, false);
            disableFields(nonfictionFields, true);
        } else if (this.value === 'Non-Fiction') {
            fictionFields.style.display = 'none';
            nonfictionFields.style.display = 'block';
            disableFields(fictionFields, true);
            disableFields(nonfictionFields, false);
        } else {
            fictionFields.style.display = 'none';
            nonfictionFields.style.display = 'none';
            disableFields(fictionFields, true);
            disableFields(nonfictionFields, true);
        }
    });

    genreSelect.addEventListener('change', function() {
        const selectedGenre = this.value;
        const subgenres = subgenresData[selectedGenre] || [];
        // Clear existing subgenres
        subgenreDiv.innerHTML = '';
        if (subgenres.length > 0) {
            subgenres.forEach(function(subgenre) {
                const label = document.createElement('label');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = 'subgenres[]';
                checkbox.value = subgenre;
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(' ' + subgenre));
                subgenreDiv.appendChild(label);
            });
        } else {
            subgenreDiv.innerHTML = 'No subgenres available for this genre.';
        }
    });
});
