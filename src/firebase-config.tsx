// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyCt7-t6K5kN6OnjyHY4ZykRFoR4yNkAqnw",
	authDomain: "laundry-92d5b.firebaseapp.com",
	projectId: "laundry-92d5b",
	storageBucket: "laundry-92d5b.appspot.com",
	messagingSenderId: "168691349849",
	appId: "1:168691349849:web:5139dabe769df3134ef448",
	measurementId: "G-RDQK9FTQB0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { app, auth, db };
