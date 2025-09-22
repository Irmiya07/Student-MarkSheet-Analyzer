window.addEventListener('DOMContentLoaded', () => {
    const fileButton = document.getElementById('fileButton');
    const fileInput = document.getElementById('fileInput');
    const resultDiv = document.getElementById('result');

    // Button click → file picker
    fileButton.addEventListener('click', () => fileInput.click());

    // Drag and drop
    const dropZone = document.getElementById('dragelement');
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            resultDiv.innerHTML = `<p style="color:green;"><strong>Selected File:</strong> ${files[0].name}</p>`;
        }
    });

    // Analyze button
    const submitBtn = document.getElementById('submit');
    submitBtn.addEventListener('click', async () => {
        if (fileInput.files.length === 0) {
            alert("Please select a file first.");
            return;
        }

        const formData = new FormData();
        const currentFile = fileInput.files[0];
        formData.append("file", currentFile);

        try {
            const response = await fetch("https://student-marksheet-analyzer-1.onrender.com", { method: "POST", body: formData });
            const data = await response.json();

            if (data.error) {
                resultDiv.innerHTML = `<p style="color:red;"><strong>Error:</strong> ${data.error}</p>`;
            } else {
                // Create a styled table for averages
                let avgTable = `<table class="result-table">
                                    <tr><th>Subject</th><th>Average Marks</th></tr>`;
                for (let subject in data.average_marks) {
                    avgTable += `<tr><td>${subject}</td><td>${data.average_marks[subject].toFixed(2)}</td></tr>`;
                }
                avgTable += `</table>`;

                resultDiv.innerHTML = `
                    <p style="color:green;"><strong>File "${currentFile.name}" uploaded successfully!</strong></p>
                    <p><strong>Total Students:</strong> ${data.total_students}</p>
                    <p><strong>Topper:</strong> ${data.topper}</p>
                    <h3>Average Marks by Subject:</h3>
                    ${avgTable}
                `;
            }

            // Reset file input
            fileInput.value = "";
        } catch (error) {
            console.error("Error:", error);
            alert("Could not connect to backend. Is Flask running?");
        }
    });
});
