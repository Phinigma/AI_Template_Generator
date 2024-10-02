document.addEventListener('DOMContentLoaded', function () {
    // Access the embedded JSON data (if needed)
    const promptDataScript = document.getElementById('prompt-data');
    if (promptDataScript) {
        const promptData = JSON.parse(promptDataScript.textContent);
        console.log('User Inputs:', promptData);
    }
});

// Function to copy prompt to clipboard
function copyPrompt() {
    var copyText = document.getElementById("final_prompt");
    // Modern approach using Clipboard API
    navigator.clipboard.writeText(copyText.value).then(function() {
        alert("Prompt copied to clipboard!");
    }, function(err) {
        console.error('Could not copy text: ', err);
        // Fallback method
        copyText.select();
        copyText.setSelectionRange(0, 99999); /* For mobile devices */
        document.execCommand("copy");
        alert("Prompt copied to clipboard!");
    });
}