import "./order.css";
import { db } from "../../firebase";
import { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import FoodCard from "../../components/foodcard/FoodCard";

function Order() {
  const [meals, setMeals] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      await getCategories();
      await getMeals();
    })();
  }, []);

  const getCategories = async () => {
    const q = query(collection(db, "meals"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const res = { ...doc.data() };
      if (!categories.includes(res.category, 0))
        setCategories((prev) => [...prev, res.category]);
    });
  };

  const getMeals = async () => {
    const q = query(collection(db, "meals"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const res = { ...doc.data(), id: doc.id };
      setMeals((prev) => [...prev, res]);
    });
  };

  return (
    <div className="order-container">
      <div className="order-hero">This is order hero!</div>
      {categories.map((category) => {
        return (
          <div className="category-container" key={category}>
            <h3 className="category-title">{category}</h3>
            <div className="food-cards-container">
              {meals.map((meal) => {
                if (meal.category === category) {
                  return <FoodCard key={meal.id} props={meal} />;
                }
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Order;
