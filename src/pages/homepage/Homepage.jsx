import "./homepage.css";
import DeliveryMan from "../../assets/Delivery Man.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhyUsCard from "../../components/whyuscard/WhyUsCard";
import FoodCard from "../../components/foodcard/FoodCard";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { UserAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function createData(id, image, name, category, ingredients, price) {
  return { id, image, name, category, ingredients, price };
}

let ln = 0;

function Homepage() {
  const { user } = UserAuth();
  const navigate = useNavigate();
  const [meals, setMeals] = useState([]);
  const [random, setRandom] = useState([]);

  useEffect(() => {
    (async () => {
      await getMeals();
      getRandomFour();
    })();
  }, []);

  const getMeals = async () => {
    ln = 0;
    const q = query(collection(db, "meals"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      ln += 1;
      const res = { ...doc.data(), id: doc.id };
      setMeals((prev) => [...prev, res]);
    });
  };

  function getRandomFour() {
    const random = [];
    const maxLn = ln >= 4 ? 4 : ln;

    while (random.length !== maxLn) {
      const randomNumber = Math.floor(Math.random() * ln);
      if (!random.includes(randomNumber)) {
        random.push(randomNumber);
      }
    }

    setRandom(random);
  }

  return (
    <div className="homepage-wrapper">
      <div className="homepage-hero">
        <div className="homepage-hero-left">
          <h1 className="homepage-hero-title">
            A <span>hungry</span> must not go to food<span>.</span> the{" "}
            <span>food</span> will go to hungry
            <span>.</span>
          </h1>
          <p className="homepage-hero-pharagraph">
            Your favorite restaurant now have a delivery. Fast delivery and
            fresh food are always a winning combination. Blink and your food is
            ready.
          </p>
          <button
            onClick={() => {
              navigate("/order");
            }}
            disabled={user ? false : true}
          >
            Order now{" "}
            <ArrowForwardIcon
              className="arrow-icon"
              style={{ color: "white" }}
            />
          </button>
        </div>
        <div className="homepage-hero-right">
          <img fetchpriority="high" src={DeliveryMan} alt="delivery-man" />
        </div>
      </div>

      <div className="why-us-section-container">
        <div className="why-us-top">
          <h1 className="why-us-title">Why Choose Us?</h1>
          <p className="why-us-pharagraph">
            We are offering all you regard. Few clicks are all we need to make
            and deliver your food. Fair trade?
          </p>
        </div>

        <WhyUsCard />
      </div>

      <div className="featured-food-container">
        <h1 className="featured-title">Our featured food</h1>
        <p className="featured-pharagraph">
          Cant decide what to order? Here are some of best selling meals for
          you.
        </p>

        <div className="food-cards">
          {random.map((index) => {
            return <FoodCard key={meals[index]?.id} props={meals[index]} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
