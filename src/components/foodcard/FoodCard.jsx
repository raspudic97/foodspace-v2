import "./foodcard.css";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { UserAuth } from "../../contexts/AuthContext";
import { CartFunctionality } from "./../../contexts/CartContext";
import { useEffect, useState } from "react";

function FoodCard({ props }) {
  const { user } = UserAuth();
  const { addToCart, cartItems, removeFromCart } = CartFunctionality();
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    if (isItemInCart(props.id)) {
      setIsInCart(true);
    }
  }, []);

  const isItemInCart = (id) => {
    return cartItems.some((item) => item.id === id);
  };

  return (
    <div className="food-card">
      {props.sale ? (
        <p className="sale-label">- {props.sale_percentage}%</p>
      ) : (
        ""
      )}
      <img src={props.photo_url} alt="meal" />
      <h3 className="food-card-title">{props.name}</h3>
      <p className="food-card-ingredients">{props.ingredients}</p>
      {!props.sale ? (
        <h3 className="food-card-price">{props.price} $</h3>
      ) : (
        <div className="sale-price-container">
          <h3 className="food-card-price old-price">{props.price} $</h3>
          <h3 className="food-card-price">{props.sale_price}$</h3>
        </div>
      )}
      <button
        onClick={
          isItemInCart(props.id)
            ? () => {
                removeFromCart(props.id);
                setIsInCart(!isInCart);
              }
            : () => {
                addToCart(props.id);
                setIsInCart(!isInCart);
              }
        }
        disabled={user ? false : true}
      >
        {isInCart ? "Remove" : "Add to cart"}
        <AddShoppingCartIcon className="add-to-cart-icon" />
      </button>
    </div>
  );
}

export default FoodCard;
