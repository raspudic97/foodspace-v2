import "./newmeal.css";
import DashboardSidebar from "./../../../components/dashboard-sidebar/DashboardSidebar";
import { useRef, useState } from "react";
import { db, storage } from "../../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

let photoURL = "";

function NewMeal() {
  const mealNameRef = useRef(null);
  const mealIngredientsRef = useRef(null);
  const mealPriceRef = useRef(null);
  const mealPictureRef = useRef(null);
  const mealCategoryRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFormFilled, setIsFormFilled] = useState(false);
  const [photo, setPhoto] = useState(null);

  //Storage functions
  async function upload(file, fileName) {
    setIsUploading(true);
    const fileRef = ref(storage, `meals-pictures/${fileName}`);
    await uploadBytes(fileRef, file);

    await getDownloadURL(fileRef).then((url) => {
      photoURL = url;
    });
  }

  //Add meal to firebase
  async function addMeal(category, name, ingredients, price) {
    const mealData = {
      category,
      name,
      price,
      ingredients,
      photo_url: photoURL,
      sale: false,
      sale_percentage: 0,
    };

    const docRef = collection(db, "meals");

    await addDoc(docRef, mealData).catch((error) => {
      console.log(error);
    });

    setIsUploading(false);
  }

  function resetForm() {
    mealCategoryRef.current.value = "";
    mealNameRef.current.value = "";
    mealIngredientsRef.current.value = "";
    mealPictureRef.current.value = "";
    mealPriceRef.current.value = 0;
  }

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleAddMeal = async () => {
    if (
      mealCategoryRef.current.value &&
      mealNameRef.current.value &&
      mealIngredientsRef.current.value &&
      mealPriceRef.current.value &&
      mealPictureRef.current.value
    ) {
      await upload(photo, photo.name);
      await addMeal(
        mealCategoryRef.current.value,
        mealNameRef.current.value,
        mealIngredientsRef.current.value,
        mealPriceRef.current.value
      );
    }

    resetForm();
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar active="meals" />
      <div className="dashboard-content">
        <form className="add-new-meal-form">
          <input
            ref={mealNameRef}
            type="text"
            placeholder="Meal name"
            required
          />
          <input
            ref={mealCategoryRef}
            type="text"
            placeholder="Category"
            required
          />
          <input
            ref={mealIngredientsRef}
            type="text"
            placeholder="Meal ingredients"
            required
          />
          <input
            ref={mealPriceRef}
            type="number"
            placeholder="Meal price"
            required
          />
          <input
            ref={mealPictureRef}
            onChange={handleChange}
            type="file"
            placeholder="Meal picture"
            required
          />
          <button
            type="submit"
            disabled={isUploading}
            onClick={() => {
              handleAddMeal();
            }}
          >
            Add new meal
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewMeal;
