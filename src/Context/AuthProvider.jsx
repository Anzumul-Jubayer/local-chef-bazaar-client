import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "@firebase/auth";
import { auth } from "../Firebase/firebase.config";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, SetLoading] = useState(true);
  
  // Google Auth Provider
  const googleProvider = new GoogleAuthProvider();
  
  const createUser = (email, password) => {
    SetLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  
  const signIn = (email, password) => {
    SetLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    SetLoading(true);
    return signInWithPopup(auth, googleProvider);
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

  // Function to update user data in real-time (for profile updates)
  const updateUserData = async (updatedData) => {
    try {
      console.log('updateUserData called with:', updatedData);
      console.log('Current user:', user);
      
      // Ensure we have a valid user object
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Update Firebase user profile if displayName or photoURL changed
      if (updatedData.name || updatedData.photoURL) {
        await updateProfile(user, {
          displayName: updatedData.name || user.displayName,
          photoURL: updatedData.photoURL || user.photoURL,
        });
      }
      
      // Force a re-render by updating the user state
      // This will trigger the navbar to show updated information
      const updatedUser = {
        ...user,
        displayName: updatedData.name || user.displayName,
        photoURL: updatedData.photoURL || user.photoURL,
      };
      
      setUser(updatedUser);
      
      // Add a brief visual indicator that the profile was updated
      setTimeout(() => {
        const profileElements = document.querySelectorAll('.navbar-profile-indicator');
        profileElements.forEach(el => {
          el.classList.add('update-success-pulse');
          setTimeout(() => {
            el.classList.remove('update-success-pulse');
          }, 1000);
        });
      }, 100);
      
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  const authInfo = {
    user,
    setUser,
    createUser,
    signIn,
    signInWithGoogle,
    signOutFunc,
    updateProfileFunc,
    updateUserData, // New function for real-time profile updates
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
