import { createContext, useContext, useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Loading from "./../components/loading/Loading";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [userFromFirestore, setUserFromFirestore] = useState(null);
  const location = useLocation();

  //Hide modals after login/signup. Hide dropdown on default
  const [modalType, setModalType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Monitor user changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (authUser) => {
      authUser ? setUser(authUser) : setUser(null);

      setIsInitialized(true);
    });

    return () => {
      unsub();
    };
  }, []);

  // Get user from firestore
  useEffect(() => {
    (async () => {
      const newUserData = await getFirestoreUserData();
      setUserFromFirestore(newUserData);
    })();
  }, [auth.currentUser]);

  //Close modal on redirect
  useEffect(() => {
    setShowDropdown(false);
    setShowModal(false);
  }, [location]);

  //Sign Up Function
  const createUserAccount = async (
    username,
    email,
    password,
    confirmPassword
  ) => {
    setAuthError(null);
    try {
      if (password !== confirmPassword) {
        throw new Error("Password don't match !");
      }

      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).catch((error) => {
        setAuthError(error.message.split(":")[1].split("(")[0]);
      });

      updateProfile(auth.currentUser, {
        displayName: username,
      });

      const aditionalData = {
        id: response.user.uid,
        role: "user",
        email: response.user.email,
        username: username,
        address: "",
        profile_photo_url: "",
        orders: [],
      };

      const docRef = doc(db, "users", `${response.user.uid}`);

      await setDoc(docRef, aditionalData);

      const cartRef = doc(db, "cart", `${response.user.uid}`);

      await setDoc(cartRef, {
        meals_id: [],
        user_id: `${response.user.uid}`,
      });

      if (!authError) {
        setShowModal(false);
        setShowDropdown(false);
      }
    } catch (error) {
      setAuthError(error.message.split(":")[1].split("(")[0]);
      console.log(error);
    }
  };

  //Login function
  const login = async (email, password) => {
    setAuthError(null);

    await signInWithEmailAndPassword(auth, email, password).catch((error) => {
      setAuthError(
        "Something went wrong!\n Check your account informations and try again"
      );
      console.log(error);
    });

    if (!authError) {
      setShowModal(false);
      setShowDropdown(false);
    }
  };

  //Logout function
  const logout = () => {
    signOut(auth).catch((error) => {
      setAuthError(error.message);
    });
  };

  //Get user from firestore
  const getFirestoreUserData = async () => {
    const docRef = doc(db, "users", `${auth.currentUser?.uid}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return null;
    }
  };

  if (isInitialized === false && !userFromFirestore) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        createUserAccount,
        logout,
        authError,
        login,
        isInitialized,
        modalType,
        setModalType,
        showModal,
        setShowModal,
        showDropdown,
        setShowDropdown,
        userFromFirestore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
