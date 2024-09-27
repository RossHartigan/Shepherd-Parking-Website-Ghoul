// Import the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const realTimeDb = getDatabase(app);
 
export { db, realTimeDb };