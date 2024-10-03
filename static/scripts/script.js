document.addEventListener('DOMContentLoaded', function() {
    const workTypeSelect = document.getElementById('work_type');
    const fictionFields = document.getElementById('fiction_fields');
    const nonfictionFields = document.getElementById('nonfiction_fields');
    const genreSelect = document.getElementById('genre');
    const subgenreDiv = document.getElementById('subgenre_div');
    let genresData = {};

    // Fetch genres configuration from the server
    fetch('/config/genres.json')
        .then(response => response.json())
        .then(data => {
            genresData = data;
            populateGenres();
        })
        .catch(error => {
            console.error('Error fetching genres configuration:', error);
        });

    function populateGenres() {
        workTypeSelect.addEventListener('change', function() {
            const selectedWorkType = this.value;
            const genreSelectElement = document.getElementById('genre');
            genreSelectElement.innerHTML = '<option value="" disabled selected>Select a genre</option>';

            if (selectedWorkType && genresData[selectedWorkType]) {
                const genres = Object.keys(genresData[selectedWorkType].genres);
                genres.forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre;
                    option.textContent = genre;
                    genreSelectElement.appendChild(option);
                });

                // Populate Desired Length based on work type
                const lengthSelect = document.getElementById('length');
                const nonfictionLengthSelect = document.getElementById('length_nonfiction');

                if (selectedWorkType === 'Fiction') {
                    lengthSelect.innerHTML = '<option value="" disabled selected>Select length</option>';
                    genresData[selectedWorkType].lengths.forEach(length => {
                        const option = document.createElement('option');
                        option.value = length;
                        option.textContent = length;
                        lengthSelect.appendChild(option);
                    });
                } else if (selectedWorkType === 'Non-Fiction') {
                    nonfictionLengthSelect.innerHTML = '<option value="" disabled selected>Select length</option>';
                    genresData[selectedWorkType].lengths.forEach(length => {
                        const option = document.createElement('option');
                        option.value = length;
                        option.textContent = length;
                        nonfictionLengthSelect.appendChild(option);
                    });
                }
            }
        });
    }

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
        const selectedWorkType = workTypeSelect.value;
        const subgenres = genresData[selectedWorkType].genres[selectedGenre] || [];
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

    // Copy to Clipboard functionality using modern Clipboard API
    function copyPrompt() {
        var copyText = document.getElementById("final_prompt");
        navigator.clipboard.writeText(copyText.value)
            .then(() => {
                alert("Prompt copied to clipboard!");
            })
            .catch((err) => {
                console.error("Error copying text: ", err);
                alert("Failed to copy prompt.");
            });
    }

});