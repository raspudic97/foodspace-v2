import "./homepage.css";
import DeliveryMan from "../../assets/Delivery Man.png";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhyUsCard from "../../components/whyuscard/WhyUsCard";
import FoodCard from "../../components/foodcard/FoodCard";
import { UserAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const { user } = UserAuth();
  const navigate = useNavigate();

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
          <FoodCard />
          <FoodCard />
          <FoodCard />
          <FoodCard />
        </div>
      </div>
    </div>
  );
}

export default Homepage;
