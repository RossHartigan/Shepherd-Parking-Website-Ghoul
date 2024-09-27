// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessageDiv = document.getElementById('error-message');

// Change this to the correct Cloud Function URL
const verificationFunctionURL = "https://sendverificationcode-ve7peupjfa-uc.a.run.app";

// Call the verification function
// Call the verification function
async function sendVerificationRequest(email) {
    const lastSentTime = sessionStorage.getItem('verificationSentAt');
    const currentTime = new Date().getTime();

    // Prevent sending another email if one was sent within the last 5 minutes
    if (lastSentTime && (currentTime - lastSentTime) < 5 * 60 * 1000) {
        throw new Error('A verification code was recently sent. Please wait before requesting a new one.');
    }

    try {
        const response = await fetch(verificationFunctionURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Verification code sent:', data.code); 

            // Store the code and the time it was sent
            sessionStorage.setItem('verificationCode', data.code);
            sessionStorage.setItem('verificationSentAt', currentTime); // Save current time
            sessionStorage.setItem('adminEmail', email); // Store the email for verification

            return data.code;
        } else {
            throw new Error('Failed to send verification email');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Function to Display Error Messages
function displayError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.style.display = 'block';
    console.log(`Error message displayed: ${message}`);
}

// Clear Error Message
function clearError() {
    errorMessageDiv.textContent = '';
    errorMessageDiv.style.display = 'none';
    console.log("Cleared error message.");
}

// Simple email validation
function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
}

// Check if the user exists in the 'admins' collection
async function isAdmin(email) {
    console.log(`Checking if ${email} is an admin.`);
    const adminQuery = query(collection(db, 'admins'), where('AdminEmail', '==', email));
    const querySnapshot = await getDocs(adminQuery);
    console.log(`Admin check result for ${email}: ${!querySnapshot.empty}`);
    return !querySnapshot.empty; // Returns true if admin exists, otherwise false
}

// Handle Login with Email and Password
loginBtn.addEventListener('click', async (event) => {
    event.preventDefault(); // Prevent form from submitting

    clearError(); // Clear any existing error messages

    const email = emailInput.value;
    const password = passwordInput.value;

    // Basic validation for empty fields
    if (!email || !password) {
        displayError("Email and password are required.");
        return;
    }

    // Check if the email is in the correct format
    if (!isValidEmail(email)) {
        displayError("Email must include an '@' and a valid domain like '.com'.");
        return;
    }

    try {
        // Check if the user is in the admins collection first
        const isAdminUser = await isAdmin(email);
        if (!isAdminUser) {
            displayError("You do not have admin access.");
            return;
        }

        console.log(`Logging in admin ${email}`);

        // If the user is an admin, proceed with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Use the verification function to send the verification email
        const verificationCode = await sendVerificationRequest(email);
        console.log(`Verification code sent to ${email}.`);

        alert(`A verification code has been sent to ${email}`);
        window.location.href = '/VerificationPage';  // Redirect to the verification code page

    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;

        // Debugging: Log the error code and message to the console
        console.log("Error code:", errorCode);
        console.log("Error message:", errorMessage);

        // Handle specific error codes
        if (errorCode === 'auth/wrong-password') {
            displayError("Email or Password is incorrect.");
        } else if (errorCode === 'auth/user-not-found') {
            displayError("Account does not exist.");
        } else if (errorCode === 'auth/invalid-email') {
            displayError("Email must include an '@' and a valid domain like '.com'.");
        } else {
            displayError("An unexpected error occurred. Please try again.");
        }
    }
});
