// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getStorage, ref, uploadBytes, deleteObject, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

// Firebase config and initialization
const firebaseConfig = {
    apiKey: "AIzaSyDCY8rufFnmvmvW5QMF989chBEZbF6ytOg",
    authDomain: "myapp-32598.firebaseapp.com",
    projectId: "myapp-32598",
    storageBucket: "myapp-32598.appspot.com",
    messagingSenderId: "349027005",
    appId: "1:349027005:web:3c3e13461b93aa3b9355d4",
    measurementId: "G-K9X4PVX4C7"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);

document.getElementById('submit-pin').onclick = function() {
    const pin = document.getElementById('pin').value;
    if (pin === '2005') {
        document.getElementById('pin-container').style.display = 'none';
        document.getElementById('auth-container').style.display = 'block';
    } else {
        alert('Incorrect PIN. Please try again.');
    }
};

document.getElementById('login-button').onclick = async function() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('content').style.display = 'block';
        fetchFiles();
        loadMessages();
        updateClock();
        displayCalendar();
        displayLocation();
    } catch (error) {
        alert("Authentication failed: " + error.message);
    }
};

// File upload, delete, and fetch functions
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

// Message saving and loading
document.getElementById('saveMessageButton').onclick = async function() {
    const message = document.getElementById('messageInput').value;
    if (message) {
        await addDoc(collection(db, "messages"), {
            text: message,
            timestamp: new Date()
        });
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

// Location Display
function displayLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            document.getElementById('location').innerText = `Latitude: ${latitude}, Longitude: ${longitude}`;
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}
