const video = document.getElementById('camera');
const canvas = document.getElementById('snapshot');
const captureBtn = document.getElementById('captureBtn');
const form = document.getElementById('attendanceForm');
const result = document.getElementById('result');
const recordsDiv = document.getElementById('records');

let capturedImage = null;

// Start camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => { video.srcObject = stream; })
  .catch(err => alert("Camera access denied!"));

// Capture image
captureBtn.addEventListener('click', () => {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  capturedImage = canvas.toDataURL('image/png');
  result.innerHTML = "<p>✅ Face captured successfully!</p>";
});

// Submit attendance
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const roll = document.getElementById('roll').value.trim();
  const date = new Date();
  const dateStr = date.toLocaleDateString();
  const timeStr = date.toLocaleTimeString();

  if (!capturedImage) return alert("Please capture your face first!");

  const data = { name, roll, date: dateStr, time: timeStr, image: capturedImage };

  const res = await fetch('/save-attendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const resultData = await res.json();
  result.innerHTML = `<p>${resultData.message}</p>`;
  form.reset();
  capturedImage = null;
  loadRecords();
});

// Load records from MongoDB
async function loadRecords() {
  const res = await fetch('/get-attendance');
  const data = await res.json();
  recordsDiv.innerHTML = data.map(item => `
    <div class="record-item">
      <b>${item.name}</b> (${item.roll})<br>
      📅 ${item.date} ⏰ ${item.time}<br>
      <img src="${item.image}" width="100" style="margin-top:5px;border-radius:5px;">
    </div>
  `).join('');
}

// Load all records when page loads
loadRecords();
