import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "@firebase/auth";
import { auth } from "../Firebase/firebase.config";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, SetLoading] = useState(true);
  const createUser = (email, password) => {
    SetLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const signIn = (email, password) => {
    SetLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signOutFunc = () => {
    SetLoading(true);
    return signOut(auth);
  };

  const updateProfileFunc = (user, displayName, photoURL) => {
    SetLoading(true);
    return updateProfile(user, {
      displayName,
      photoURL,
    });
  };

  const authInfo = {
    user,
    setUser,
    createUser,
    signIn,

    signOutFunc,
    updateProfileFunc,
    SetLoading,
    loading,
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      SetLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
