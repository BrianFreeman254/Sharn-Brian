// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getStorage, ref, uploadBytes, listAll } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBqug40sGykkuv9G93grQ6WRVqz6gAPrNo",
    authDomain: "sharn-and-brian.firebaseapp.com",
    projectId: "sharn-and-brian",
    storageBucket: "sharn-and-brian.appspot.com",
    messagingSenderId: "1019310104584",
    appId: "1:1019310104584:web:f44a5b9d8f921838cf31bd",
    measurementId: "G-9WS245DOP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

// Pin functionality
document.getElementById('submit-pin').onclick = function() {
    const pin = document.getElementById('pin').value;
    if (pin === '2005') {
        document.getElementById('content').style.display = 'block';
        document.getElementById('pin-container').style.display = 'none';
        fetchFiles(); 
        loadMessages();
        loadQuestions();
        setInterval(updateClock, 1000); 
        displayCalendar(); 
    } else {
        alert('Incorrect PIN. Please try again.');
    }
};

// File upload functionality
document.getElementById('uploadButton').onclick = function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const storageRef = ref(storage, 'uploads/' + file.name);
        uploadBytes(storageRef, file).then(() => {
            alert('File uploaded successfully!');
            fetchFiles(); 
        }).catch((error) => {
            alert('Error uploading file: ' + error.message);
        });
    } else {
        alert('Please select a file to upload.');
    }
};

// Digital clock function
function updateClock() {
    const now = new Date();
    const options = { timeZone: 'Africa/Nairobi', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const timeString = now.toLocaleTimeString('en-US', options);
    document.getElementById('digitalClock').innerText = timeString;
}

// Calendar function
function displayCalendar() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = `<h3>Today: ${now.toLocaleDateString('en-US', options)}</h3>`;
}