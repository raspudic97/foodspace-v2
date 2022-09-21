import "./foodcard.css";
import Pizza from "../../assets/pizza.png";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

function FoodCard() {
  return (
    <div className="food-card">
      <img src={Pizza} alt="meal" />
      <h3 className="food-card-title">Pizza Capriciosa</h3>
      <p className="food-card-ingredients">Cheese, Tomato sauce, Salami</p>
      <h3 className="food-card-price">12.99 $</h3>
      <button>
        Add to cart <AddShoppingCartIcon className="add-to-cart-icon" />
      </button>
    </div>
  );
}

export default FoodCard;
