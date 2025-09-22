window.addEventListener('DOMContentLoaded', () => {
  const fileButton = document.getElementById('fileButton');
  const fileInput = document.getElementById('fileInput');
  const dropZone = document.getElementById('dropZone');
  const submitBtn = document.getElementById('submit');
  const result = document.getElementById('result');

  // Open file dialog
  fileButton.addEventListener('click', () => fileInput.click());

  // Drag & drop
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) fileInput.files = files;
  });

  // Analyze Marks
  submitBtn.addEventListener('click', async () => {
    if (!fileInput.files.length) {
      alert("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    // Replace with your Render backend URL
    const backendUrl = "https://student-marksheet-analyzer.onrender.com/analyze";

    result.innerHTML = "Analyzing...";

    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        body: formData
      });
      const data = await response.json();

      if (data.error) {
        result.innerHTML = `<p style="color:red">${data.error}</p>`;
        return;
      }

      // Display result
      let html = `<h2>Analysis Result</h2>`;
      html += `<p><strong>Total Students:</strong> ${data.total_students}</p>`;
      html += `<p><strong>Topper:</strong> ${data.topper}</p>`;
      html += `<h3>Average Marks:</h3><ul>`;
      for (let subject in data.average_marks) {
        html += `<li>${subject}: ${data.average_marks[subject].toFixed(2)}</li>`;
      }
      html += `</ul>`;
      result.innerHTML = html;

    } catch (err) {
      result.innerHTML = `<p style="color:red">Error connecting to backend.</p>`;
      console.error(err);
    }
  });
});
