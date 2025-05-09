import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(null);
  const isAdminRef = useRef(false);

  const adminEmail = "hello11@gmail.com";

  const fetchAuthUser = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userDataFromFirestore = userDoc.data();
          setUserData({ ...currentUser, ...userDataFromFirestore });
          isAdminRef.current = currentUser.email === adminEmail;
        } else {
          isAdminRef.current = currentUser.email === adminEmail;
          setUserData({ ...currentUser });
        }
        console.log("Admin status set:", isAdminRef.current);
      } else {
        setUserData(null);
        isAdminRef.current = false;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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
    isAdminRef,
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
