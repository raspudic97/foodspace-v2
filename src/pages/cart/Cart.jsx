import "./cart.css";
import { CartFunctionality } from "./../../contexts/CartContext";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  getDocs,
  query,
  collection,
  serverTimestamp,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { UserAuth } from "../../contexts/AuthContext";

function createData(id, image, name, price, quantity) {
  return { id, image, name, price, quantity };
}

function Cart() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const { user, userFromFirestore } = UserAuth();
  const { cartItems, setCartItems, increaseQuantity, decreaseQuantity } =
    CartFunctionality();

  useEffect(() => {
    setTotal(0);
    (async () => {
      await getItemsInfo();
    })();
  }, [cartItems]);

  const getItemsInfo = async () => {
    setRows([]);
    const q = query(collection(db, "meals"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      if (isItemInCart(doc.id)) {
        const res = doc.data();
        const saleTotal = res.sale ? parseFloat(res.sale_price) : res.price;
        const currItem = cartItems.filter((item) => item.id === doc.id);
        const subtotal = saleTotal * currItem[0].quantity;

        setTotal((prev) => prev + subtotal);
        setRows((prev) => [
          ...prev,
          createData(
            doc.id,
            res.photo_url,
            res.name,
            saleTotal,
            currItem[0].quantity
          ),
        ]);
      }
    });
  };

  const isItemInCart = (id) => {
    return cartItems.some((item) => item.id === id);
  };

  const handleSubmitOrder = async () => {
    if (rows.length > 0 && total > 0) {
      const docRef = collection(db, "orders");
      // Rows -> Array of objects with meals from cart
      const orderData = {
        order_meals: rows,
        order_status: "pending",
        total,
        user_id: `${user?.uid}`,
        address: `${userFromFirestore?.address}`,
        created_at: serverTimestamp(),
      };

      await addDoc(docRef, orderData).then(async () => {
        setCartItems([]);
        setRows([]);
        const docRef = doc(db, "cart", `${user?.uid}`);
        await updateDoc(docRef, { meals_id: [] });
        alert("Your order has been placed successfully");
      });
    }
  };

  return (
    <div className="cart-container">
      <div className="cart-column-titles">
        <p className="first-child">Meal</p>
        <p>Quantity</p>
        <p>Subtotal</p>
      </div>
      <div className="cart-meal-container">
        {rows.map((row) => {
          return (
            <div key={row.id} className="cart-single-meal">
              <div className="cart-meal first-child">
                <img className="cart-meal-img" src={row.image} alt="" />
                {row.name}
              </div>
              <div className="cart-meal-quantity">
                <p>
                  <span onClick={() => decreaseQuantity(row.id)}>-</span>{" "}
                  {row.quantity}{" "}
                  <span onClick={() => increaseQuantity(row.id)}>+</span>
                </p>
              </div>
              <div className="cart-subtotal">{row.price} $</div>
            </div>
          );
        })}
      </div>
      <div className="cart-total-container">
        <div className="cart-total">
          <p>
            <span>Total</span> : {total.toFixed(2)} $
          </p>

          <button
            disabled={
              rows.length === 0 ||
              total === 0 ||
              userFromFirestore?.address === ""
                ? true
                : false
            }
            onClick={() => handleSubmitOrder()}
          >
            Proceed to checkout
          </button>
          {rows.length === 0 ? (
            <p className="show-error">
              Cant proceed to checkout if you dont have any items in cart.
            </p>
          ) : (
            ""
          )}
          {userFromFirestore?.address === "" ? (
            <p className="show-error">
              Make sure you set your address in "My profile" section.
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
