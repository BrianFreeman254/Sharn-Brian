// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Firebase config and initialization
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// PIN Authentication
document.getElementById('submit-pin').onclick = function() {
    const pin = document.getElementById('pin').value;
    if (pin === '2005') {
        document.getElementById('pin-container').style.display = 'none';
        document.getElementById('auth-container').style.display = 'block';
    } else {
        alert('Incorrect PIN. Please try again.');
    }
};

// Email/Password Login
document.getElementById('login-button').onclick = async function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        loadContent();
    } catch (error) {
        alert("Authentication failed: " + error.message);
    }
};

// Google Sign-In
document.getElementById('googleSignIn').onclick = async function() {
    try {
        await signInWithPopup(auth, googleProvider);
        loadContent();
    } catch (error) {
        alert("Google Sign-in error: " + error.message);
    }
};

// Function to load authenticated content
function loadContent() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    fetchFiles();
    loadMessages();
    updateClock();
    displayCalendar();
    displayLocation();
}

// Handle Auth State Changes
onAuthStateChanged(auth, (user) => {
    if (user) loadContent();
});

// File Upload, Delete, and Fetch Functions
document.getElementById('uploadButton').onclick = async function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const storageRef = ref(storage, 'uploads/' + file.name);
        await uploadBytes(storageRef, file);
        alert('File uploaded successfully!');
        fetchFiles();
    }
};

// Fetch and display files in organized tabs
async function fetchFiles() {
    const listRef = ref(storage, 'uploads/');
    const res = await listAll(listRef);
    const fileLinks = document.getElementById('fileList');
    fileLinks.innerHTML = '';
    for (const itemRef of res.items) {
        const url = await getDownloadURL(itemRef);
        const fileLink = document.createElement('a');
        fileLink.href = url;
        fileLink.textContent = itemRef.name;
        fileLink.target = '_blank';
        fileLinks.appendChild(fileLink);
    }
}

// Message Saving and Loading
document.getElementById('saveMessageButton').onclick = async function() {
    const message = document.getElementById('messageInput').value;
    if (message) {
        await addDoc(collection(db, "messages"), { text: message, timestamp: new Date() });
        document.getElementById('messageInput').value = '';
        loadMessages();
    }
};

async function loadMessages() {
    const messagesSnapshot = await getDocs(collection(db, "messages"));
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = '';
    messagesSnapshot.forEach(doc => {
        const message = document.createElement('div');
        message.textContent = doc.data().text;
        messageList.appendChild(message);
    });
}

// Clock and Calendar
function updateClock() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('digitalClock').innerText = now.toLocaleTimeString('en-US', { timeZone: 'Africa/Nairobi' });
    }, 1000);
}

function displayCalendar() {
    const now = new Date();
    document.getElementById('calendar').innerText = `Today: ${now.toDateString()}`;
}

// Location Display with Place Name
function displayLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            const { latitude, longitude } = position.coords;
            const locationName = await getLocationName(latitude, longitude); // Function to get precise place name
            document.getElementById('locationInfo').innerText = locationName || `Latitude: ${latitude}, Longitude: ${longitude}`;
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Helper function to convert latitude and longitude to place name
async function getLocationName(lat, long) {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`);
        const data = await response.json();
        return data.display_name;
    } catch (error) {
        console.error("Error fetching location name:", error);
        return null;
    }
}
