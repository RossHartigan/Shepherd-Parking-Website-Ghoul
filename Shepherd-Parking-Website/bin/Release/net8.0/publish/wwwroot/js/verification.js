// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCt6Qx4jIHFfuF-pICv9UELAsp7PGLEBgc",
    authDomain: "shepherd-9a70b.firebaseapp.com",
    databaseURL: "https://shepherd-9a70b-default-rtdb.firebaseio.com",
    projectId: "shepherd-9a70b",
    storageBucket: "shepherd-9a70b.appspot.com",
    messagingSenderId: "752353533147",
    appId: "1:752353533147:web:94b11bb6cbcb6c239280fe",
    measurementId: "G-M0NX64WE41"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const verifyBtn = document.querySelector('.verify-btn');
const verificationCodeInput = document.getElementById('verificationCode');
const errorMessageDiv = document.getElementById('error-message');

// Retrieve the stored admin email from sessionStorage
const adminEmail = sessionStorage.getItem('adminEmail');

// Function to Display Error Messages
function displayError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
}

// Clear Error Message
function clearError() {
    errorMessageDiv.textContent = '';
    errorMessageDiv.style.display = 'none';
}

// Disable button to prevent multiple submissions
function disableButton(disabled) {
    verifyBtn.disabled = disabled;
}

// Function to handle timeouts
async function sendRequestWithTimeout(url, options, timeout = 5000) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Request timed out")), timeout))
    ]);
}

// Handle Code Verification
verifyBtn.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent form from submitting

    clearError(); // Clear any existing error messages
    disableButton(true); // Disable the button during the request

    const inputCode = verificationCodeInput.value.trim(); // Trim whitespace and get input

    try {
        const response = await sendRequestWithTimeout('https://verifycode-ve7peupjfa-uc.a.run.app', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: adminEmail, code: inputCode }),
        }, 10000); // Timeout after 10 seconds

        const data = await response.json();
        if (response.ok) {
            console.log(`Welcome ${adminEmail}! Verification successful.`);
            window.location.href = '/Dashboard';  // Ensure redirection to /Dashboard
        } else {
            displayError(data.message || "Verification failed.");
        }
    } catch (error) {
        console.error('Error verifying code:', error);
        displayError("An error occurred during verification. Please try again.");
    } finally {
        disableButton(false); // Re-enable the button after the request
    }
});
