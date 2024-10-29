// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCY8rufFnmvmvW5QMF989chBEZbF6ytOg",
  authDomain: "myapp-32598.firebaseapp.com",
  projectId: "myapp-32598",
  storageBucket: "myapp-32598.appspot.com",
  messagingSenderId: "349027005",
  appId: "1:349027005:web:3c3e13461b93aa3b9355d4",
  measurementId: "G-K9X4PVX4C7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const storage = getStorage();
const firestore = getFirestore();

// PIN Authentication Logic
document.getElementById('submit-pin').onclick = function() {
    const pin = document.getElementById('pin').value;
    if (pin === '2005') {
        document.getElementById('pin-container').classList.add('hidden');
        document.getElementById('auth-container').classList.remove('hidden');
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
        console.error("Error logging in with email and password:", error);
        alert("Failed to log in. Please try again.");
    }
};

// Google Sign-In
document.getElementById('googleSignIn').onclick = async function() {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        loadContent();
    } catch (error) {
        console.error("Error with Google sign-in:", error);
        alert("Failed to log in with Google. Please try again.");
    }
};

// Function to load content after authentication
function loadContent() {
    document.getElementById('auth-container').classList.add('hidden');
    document.getElementById('content').classList.remove('hidden');
    updateClock();
    displayCalendar();
    displayLocation();
}

// Clock and Calendar Functions
function updateClock() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('digitalClock').innerText = now.toLocaleTimeString();
    }, 1000);
}

function displayCalendar() {
    const now = new Date();
    document.getElementById('calendar').innerText = `Today: ${now.toDateString()}`;
}

function displayLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            document.getElementById('locationInfo').innerText = `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`;
        });
    } else {
        document.getElementById('locationInfo').innerText = "Geolocation is not supported by this browser.";
    }
}

// File Upload Logic
document.getElementById('uploadButton').onclick = function() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (file) {
        const storageRef = storage.ref().child(`uploads/${file.name}`);
        storageRef.put(file).then(() => {
            alert('File uploaded successfully!');
            fileInput.value = '';
            listUploadedFiles();
        }).catch(error => {
            console.error("File upload error:", error);
        });
    } else {
        alert('Please select a file to upload.');
    }
};

// List Uploaded Files
function listUploadedFiles() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = ''; // Clear existing files
    const storageRef = storage.ref().child('uploads/');
    storageRef.listAll().then(res => {
        res.items.forEach(itemRef => {
            fileList.innerHTML += `<div>${itemRef.name}</div>`;
        });
    }).catch(error => {
        console.error("Error listing files:", error);
    });
}

// Save Messages Logic
document.getElementById('saveMessageButton').onclick = function() {
    const message = document.getElementById('messageInput').value;
    if (message) {
        const messagesRef = firestore.collection('messages');
        messagesRef.add({ text: message, timestamp: new Date() }).then(() => {
            alert('Message saved successfully!');
            document.getElementById('messageInput').value = '';
            displayMessages();
        }).catch(error => {
            console.error("Error saving message:", error);
        });
    } else {
        alert('Please enter a message.');
    }
};

// Display Messages
function displayMessages() {
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = ''; // Clear existing messages
    const messagesRef = firestore.collection('messages');
    messagesRef.orderBy('timestamp').get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            const message = doc.data().text;
            messageList.innerHTML += `<div>${message}</div>`;
        });
    }).catch(error => {
        console.error("Error fetching messages:", error);
    });
}

// Initialize message display
displayMessages();
