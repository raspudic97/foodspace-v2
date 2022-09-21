import "./homepage.css";
import DeliveryMan from "../../assets/Delivery Man.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WhyUsCard from "../../components/whyuscard/WhyUsCard";
import FoodCard from "../../components/foodcard/FoodCard";
import Footer from "../../components/footer/Footer";

const whyUsCards = [
  {
    icon: (
      <ShoppingCartIcon
        className="card-icon"
        style={{
          color: "rgba(255,0,0,0.75)",
          backgroundColor: "rgba(255,0,0,0.25)",
        }}
      />
    ),
    title: "Easy to order",
    body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
  },
  {
    icon: (
      <DeliveryDiningIcon
        className="card-icon"
        style={{
          color: "rgba(0,0,255,0.75)",
          backgroundColor: "rgba(0,0,255,0.25)",
        }}
      />
    ),
    title: "Fast delivery",
    body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
  },
  {
    icon: (
      <CreditScoreIcon
        className="card-icon"
        style={{
          color: "rgba(148,0,211,0.75)",
          backgroundColor: "rgba(148,0,211,0.25)",
        }}
      />
    ),
    title: "Secure payment",
    body: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
  },
];

function Homepage() {
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
          <button>
            Order now <ArrowForwardIcon style={{ color: "white" }} />
          </button>
        </div>
        <div className="homepage-hero-right">
          <img src={DeliveryMan} alt="delivery-man" />
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
        <div className="why-us-bottom">
          {whyUsCards.map((card) => (
            <WhyUsCard key={card.title} {...card} />
          ))}
        </div>
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

      <Footer />
    </div>
  );
}

export default Homepage;
