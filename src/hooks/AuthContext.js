import { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Firebase config and Firestore functions
import { getDoc, doc } from 'firebase/firestore'; // Firestore functions
import { onAuthStateChanged } from 'firebase/auth';

const useAuth = () => {
  const [userData, setUserData] = useState(null);
  const [isNewUser, setIsNewUser] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const adminEmail = '';

  useEffect(() => {
    const checkIfUserExists = async (uid) => {
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setIsNewUser(false);
        } else {
          setIsNewUser(true);
        }
      } catch (error) {
        console.error("Error checking user existence: ", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(currentUser)
        setUserData(currentUser);
        if (currentUser.email === adminEmail) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        checkIfUserExists(currentUser.uid);
      } else {
        setUserData(null);
        setIsNewUser("");
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { userData, isNewUser, isAdmin };
};

export default useAuth;
