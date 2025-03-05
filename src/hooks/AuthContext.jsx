import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(undefined); // Initially undefined
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const adminEmail = "kserh080888@gmail.com";

  // 🔥 Function to fetch authenticated user
  const fetchAuthUser = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserData({ ...currentUser, ...userData });
        } else {
          setUserData({ ...currentUser });
        }
        setIsAdmin(currentUser.email === adminEmail);
      } else {
        setUserData(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      fetchAuthUser(); // 🔥 Call function when auth state changes
    });
    return () => unsubscribe();
  }, [fetchAuthUser]);

  return (
    <AuthContext.Provider value={{ userData, isAdmin, loading, fetchAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access auth context
export default function useAuth() {
  return useContext(AuthContext);
}
