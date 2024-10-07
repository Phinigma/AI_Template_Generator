document.addEventListener('DOMContentLoaded', function () {
    const workTypeSelect = document.getElementById('work_type');
    const fictionFields = document.getElementById('fiction_fields');
    const nonfictionFields = document.getElementById('nonfiction_fields');
    let promptConfig = {};

    // Ensure both sections are hidden initially
    fictionFields.style.display = 'none';
    nonfictionFields.style.display = 'none';

    // Fetch the configuration file
    fetch('/config/prompt_config.json')
        .then(response => response.json())
        .then(data => {
            promptConfig = data;  // Store the data in promptConfig
            console.log("Prompt config loaded:", promptConfig);  // Debugging
        })
        .catch(error => {
            console.error('Error fetching prompt configuration:', error);
        });

    // Event listener for work type selection
    workTypeSelect.addEventListener('change', function () {
        const workType = this.value;
        console.log("Selected work type:", workType);  // Debugging

        // Show/hide relevant fields based on work type
        if (workType === 'Fiction') {
            showFictionFields();
        } else if (workType === 'Non-Fiction') {
            showNonFictionFields();
        } else {
            fictionFields.style.display = 'none';
            nonfictionFields.style.display = 'none';
        }
    });

    function showFictionFields() {
        populateFields('Fiction');
        fictionFields.style.display = 'block';
        nonfictionFields.style.display = 'none';
    }

    function showNonFictionFields() {
        populateFields('Non-Fiction');
        nonfictionFields.style.display = 'block';
        fictionFields.style.display = 'none';
    }

    function populateFields(workType) {
        if (workType === 'Fiction') {
            const genreSelect = document.getElementById('genre');
            const lengthSelect = document.getElementById('length');
            const toneSelect = document.getElementById('tone');
            const styleSelect = document.getElementById('writing_style');

            genreSelect.innerHTML = '';
            lengthSelect.innerHTML = '';
            toneSelect.innerHTML = '';
            styleSelect.innerHTML = '';

            // Populate Genres
            Object.keys(promptConfig[workType].genres).forEach(genre => {
                genreSelect.innerHTML += `<option value="${genre}">${genre}</option>`;
            });

            // Populate Lengths
            promptConfig[workType].lengths.forEach(length => {
                lengthSelect.innerHTML += `<option value="${length}">${length}</option>`;
            });

            // Populate Tones
            promptConfig[workType].tones.forEach(tone => {
                toneSelect.innerHTML += `<option value="${tone}">${tone}</option>`;
            });

            // Populate Writing Styles
            promptConfig[workType].writing_styles.forEach(style => {
                styleSelect.innerHTML += `<option value="${style}">${style}</option>`;
            });

            populateFictionSpecificFields();
        } else if (workType === 'Non-Fiction') {
            // If length_nonfiction is a select element
            const lengthSelect = document.getElementById('length_nonfiction');
            if (lengthSelect) {
                lengthSelect.innerHTML = '';
                // Populate Lengths
                promptConfig[workType].lengths.forEach(length => {
                    lengthSelect.innerHTML += `<option value="${length}">${length}</option>`;
                });
            } else {
                // If length_nonfiction is implemented as buttons
                const lengthDiv = document.getElementById('length_nonfiction_div');
                if (lengthDiv) {
                    lengthDiv.innerHTML = '';
                    promptConfig[workType].lengths.forEach(length => {
                        lengthDiv.innerHTML += `<button type="button" class="selection-button" data-value="${length}">${length}</button>`;
                    });
                    handleSingleSelection(lengthDiv, 'length_nonfiction');
                }
            }

            populateNonFictionSpecificFields();
        }
    }

    function populateFictionSpecificFields() {
        const narrativeSelect = document.getElementById('narrative_perspective');
        const themeDiv = document.getElementById('themes_div');
        const subgenreDiv = document.getElementById('subgenre_div');
        const genreSelect = document.getElementById('genre');

        // Populate Narrative Perspectives
        narrativeSelect.innerHTML = ''; // Clear existing options
        promptConfig.Fiction.narrative_perspectives.forEach(perspective => {
            narrativeSelect.innerHTML += `<option value="${perspective}">${perspective}</option>`;
        });

        // Populate Themes with buttons
        themeDiv.innerHTML = '';
        promptConfig.Fiction.themes.forEach(theme => {
            themeDiv.innerHTML += `<button type="button" class="selection-button theme-button" data-value="${theme}">${theme}</button>`;
        });

        // Attach event listener to theme buttons
        handleMultipleSelection(themeDiv, 'themes[]');

        // Populate Subgenres dynamically when a genre is selected
        genreSelect.addEventListener('change', function () {
            const selectedGenre = this.value;
            const subgenres = promptConfig.Fiction.genres[selectedGenre] || [];
            subgenreDiv.innerHTML = '';
            subgenres.forEach(subgenre => {
                subgenreDiv.innerHTML += `<button type="button" class="selection-button subgenre-button" data-value="${subgenre}">${subgenre}</button>`;
            });

            // Attach event listener to new subgenre buttons
            handleMultipleSelection(subgenreDiv, 'subgenres[]');
        });
    }

    function populateNonFictionSpecificFields() {
        const genreDiv = document.getElementById('genre_nonfiction_div');
        const purposeDiv = document.getElementById('purpose_div');
        const audienceDiv = document.getElementById('audience_div');
        const toneDiv = document.getElementById('tone_nonfiction_div');
        const styleDiv = document.getElementById('writing_style_nonfiction_div');

        // Populate Genres with buttons
        genreDiv.innerHTML = '';
        Object.keys(promptConfig['Non-Fiction'].genres).forEach(genre => {
            genreDiv.innerHTML += `<button type="button" class="selection-button genre-nonfiction-button" data-value="${genre}">${genre}</button>`;
        });

        // Populate Purposes with buttons
        purposeDiv.innerHTML = '';
        promptConfig['Non-Fiction'].purposes.forEach(purpose => {
            purposeDiv.innerHTML += `<button type="button" class="selection-button purpose-button" data-value="${purpose}">${purpose}</button>`;
        });

        // Populate Audiences with buttons
        audienceDiv.innerHTML = '';
        const audiences = promptConfig['Non-Fiction'].audiences || [];
        audiences.forEach(audience => {
            audienceDiv.innerHTML += `<button type="button" class="selection-button audience-button" data-value="${audience}">${audience}</button>`;
        });

        // Populate Tones with buttons
        toneDiv.innerHTML = '';
        promptConfig['Non-Fiction'].tones.forEach(tone => {
            toneDiv.innerHTML += `<button type="button" class="selection-button tone-nonfiction-button" data-value="${tone}">${tone}</button>`;
        });

        // Populate Writing Styles with buttons
        styleDiv.innerHTML = '';
        promptConfig['Non-Fiction'].writing_styles.forEach(style => {
            styleDiv.innerHTML += `<button type="button" class="selection-button writing-style-nonfiction-button" data-value="${style}">${style}</button>`;
        });

        // Attach event listeners to the buttons
        handleSingleSelection(genreDiv, 'genre_nonfiction');
        handleSingleSelection(purposeDiv, 'purpose');
        handleMultipleSelection(audienceDiv, 'audience[]');
        handleSingleSelection(toneDiv, 'tone_nonfiction');
        handleSingleSelection(styleDiv, 'writing_style_nonfiction');
    }

    function handleMultipleSelection(container, inputName) {
        const form = document.querySelector('.story-prompt-form');

        container.addEventListener('click', function (event) {
            const target = event.target;
            if (target.tagName.toLowerCase() === 'button') {
                target.classList.toggle('selected');

                // Add/remove hidden input based on button state
                if (target.classList.contains('selected')) {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = inputName;
                    input.value = target.getAttribute('data-value');
                    input.classList.add('hidden-input');
                    input.dataset.value = target.getAttribute('data-value');
                    form.appendChild(input);
                } else {
                    // Remove the corresponding hidden input from the form
                    const inputs = form.querySelectorAll(`input.hidden-input[name="${inputName}"][value="${target.getAttribute('data-value')}"]`);
                    inputs.forEach(input => input.remove());
                }
            }
        });
    }

    function handleSingleSelection(container, inputName) {
        const form = document.querySelector('.story-prompt-form');

        container.addEventListener('click', function (event) {
            const target = event.target;
            if (target.tagName.toLowerCase() === 'button') {
                // Remove 'selected' class from all buttons in the container
                const buttons = container.querySelectorAll('button');
                buttons.forEach(button => {
                    button.classList.remove('selected');
                });

                // Remove existing hidden inputs with the same name
                const existingInputs = form.querySelectorAll(`input[name="${inputName}"]`);
                existingInputs.forEach(input => input.remove());

                // Add 'selected' class to the clicked button
                target.classList.add('selected');

                // Create new hidden input with the selected value
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = inputName;
                input.value = target.getAttribute('data-value');
                form.appendChild(input);
            }
        });
    }

    // Remove unnecessary event listeners for hover effects if CSS handles it
    // If you want to add hover effects via JavaScript, you can uncomment the following code:

    /*
    // Add hover effect to buttons (optional if you have CSS handling this)
    document.addEventListener('mouseover', function (event) {
        if (event.target.tagName.toLowerCase() === 'button') {
            event.target.classList.add('hover');
        }
    });

    document.addEventListener('mouseout', function (event) {
        if (event.target.tagName.toLowerCase() === 'button') {
            event.target.classList.remove('hover');
        }
    });
    */
});
