import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(undefined); // Initially undefined
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const adminEmail = "sawant@nusterai.com"; // Replace with your admin email

  // Function to fetch authenticated user
  const fetchAuthUser = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userDataFromFirestore = userDoc.data();
          setUserData({ ...currentUser, ...userDataFromFirestore });
        } else {
          setUserData({ ...currentUser });
        }

        // Set admin status based on email
        setIsAdmin(currentUser.email === adminEmail);
        console.log("Admin status set:", currentUser.email === adminEmail);
      } else {
        setUserData(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    setLoading(false);
  }, []);

  // Debug logging
  useEffect(() => {
    if (userData) {
      console.log("User data updated:", userData);
      console.log("Is admin:", isAdmin);
    }
  }, [userData, isAdmin]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Auth state changed - user found:", user.email);
      } else {
        console.log("Auth state changed - no user");
      }
      fetchAuthUser();
    });

    return () => unsubscribe();
  }, [fetchAuthUser]);

  const value = {
    userData,
    isAdmin,
    loading,
    fetchAuthUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export default function useAuth() {
  return useContext(AuthContext);
}
