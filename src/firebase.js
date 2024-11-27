// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,browserLocalPersistence,setPersistence } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import Firestore functions
import { getStorage } from "firebase/storage";



const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app); // Initialize Firestore
const storage = getStorage(app)

// Function to save user data to Firestore
const saveUserToFirestore = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid); // Create a reference to a document for the user
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: new Date(),
    });
    console.log("User data saved to Firestore");
  } catch (error) {
    console.error("Error saving user data to Firestore:", error);
  }
};

// Google sign-in function
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // Save user data to Firestore
    return user; // Return the user details if needed
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};
// Google sign-in function
const signUpWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // Save user data to Firestore
      await saveUserToFirestore(user);
      return user; // Return the user details if needed
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to local");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

// Export necessary functions
export { auth, createUserWithEmailAndPassword, signInWithGoogle, signUpWithGoogle,db,storage  };
