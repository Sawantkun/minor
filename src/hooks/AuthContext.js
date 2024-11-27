// src/hooks/AuthContext.js

import { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Import Firebase config and Firestore functions
import { getDoc, doc } from 'firebase/firestore'; // Import getDoc to fetch data

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        try {
          // Fetch user data from Firestore (don't update it)
          const userRef = doc(db, 'users', authUser.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            setUserData(docSnap.data()); // Set user data without modifying Firestore
          } else {
            console.error("No user data found in 'users' collection.");
            setUserData(null); // Clear userData if not found
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return unsubscribe;
  }, []);

  return { user, userData };
};

export default useAuth; // Ensure useAuth is exported as default
