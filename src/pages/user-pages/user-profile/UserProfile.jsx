import "./userprofile.css";
import DefaultProfilePic from "../../../assets/default-profile-picture.png";
import { db, auth, storage } from "../../../firebase";
import { updateProfile, updatePassword } from "firebase/auth";
import { UserAuth } from "../../../contexts/AuthContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";

let photoURL = "";

function UserProfile() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const addressRef = useRef(null);
  const profilePictureRef = useRef(null);
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalDeclined, setTotalDeclined] = useState(0);
  const { user } = UserAuth();

  useEffect(() => {
    const colRef = collection(db, "orders");

    const unsub = onSnapshot(colRef, (snapshot) => {
      setCount(0);
      setTotalSpent(0);

      snapshot.docs.forEach((doc) => {
        const res = doc.data();

        if (res.user_id === user?.uid && res.order_status !== "declined") {
          setCount((prev) => prev + 1);
          setTotalSpent((prev) => prev + res.total);
        } else if (
          res.user_id === user?.uid &&
          res.order_status === "declined"
        ) {
          setTotalDeclined((prev) => prev + 1);
        }
      });
    });

    return unsub;
  }, []);

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    } else {
      setPhoto(null);
    }
  };

  async function handleUpdatePhoto(file, fileName) {
    const fileRef = ref(storage, `users-profile-pictures/${fileName}`);
    await uploadBytes(fileRef, file);

    await getDownloadURL(fileRef).then((url) => {
      photoURL = url;
    });
  }

  async function updateUserProfile() {
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    const address = addressRef.current.value;
    const profilePicture = profilePictureRef.current.value;

    await updateProfile(auth.currentUser, {
      ...(username && { displayName: username }),
      ...(photoURL && { photoURL: photoURL }),
    });

    if (password === confirmPassword && password.length > 5) {
      await updatePassword(auth.currentUser, password)
        .then(() => {
          setError("");
        })
        .catch((error) => {
          alert(
            "You are logged in for a long time. You need to sign out, then log in again for password change. Your other changes will be saved."
          );
        });
    } else {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
      }
      if (password.length < 6 && password && confirmPassword) {
        setError("Password must be 6 characters or longer");
      }
    }

    const userRef = doc(db, "users", `${user?.uid}`);

    const newUserData = {
      ...(username && { username: username }),
      ...(address && { address: address }),
      ...(profilePicture && { profile_photo_url: photoURL }),
    };

    await updateDoc(userRef, newUserData);
  }

  function resetForm() {
    usernameRef.current.value = null;
    passwordRef.current.value = null;
    confirmPasswordRef.current.value = null;
    addressRef.current.value = null;
    profilePictureRef.current.value = null;
  }

  async function handleUpdate() {
    setIsUploading(true);
    if (profilePictureRef.current.value) {
      await handleUpdatePhoto(photo, photo.name);
    }

    await updateUserProfile();
    resetForm();
    setIsUploading(false);
  }

  return (
    <div className="user-profile-container">
      <div className="user-profile-top">
        <img
          src={user?.photoURL ? user.photoURL : DefaultProfilePic}
          alt="profile"
        />

        <h3>{user?.displayName}</h3>

        <div className="profile-stats-container">
          <div className="profile-stats">
            <p>Orders placed</p>
            <p>{count}</p>
          </div>
          <div className="profile-stats">
            <p>Orders declined</p>
            <p>{totalDeclined}</p>
          </div>
          <div className="profile-stats">
            <p>Money spent</p>
            <p>{totalSpent.toFixed(2)} $</p>
          </div>
        </div>
      </div>

      <div className="user-profile-body">
        <form>
          <input ref={usernameRef} type="text" placeholder="Username" />
          <input ref={passwordRef} type="password" placeholder="New Password" />
          <input
            ref={confirmPasswordRef}
            type="password"
            placeholder="Confirm new password"
          />
          <input ref={addressRef} type="text" placeholder="Address" />
          <input
            ref={profilePictureRef}
            onChange={handleChange}
            type="file"
            placeholder="Profile picture"
          />

          <button disabled={isUploading} onClick={() => handleUpdate()}>
            Edit profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserProfile;
