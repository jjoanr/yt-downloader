// download.js

function selectDownloadLocation() {
    // Open file picker dialog
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.directory = true;
    input.multiple = false;
    input.click();

    // Listen for change event on file input
    input.addEventListener('change', (event) => {
        const files = event.target.files;
        if (files.length > 0) {
        const downloadLocation = files[0].path; // Get selected directory path
        // Use downloadLocation for downloading the content
        alert("Selected download location: " + downloadLocation);
        }
    });
}