import { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { UserAuth } from "./AuthContext";
import Loading from "../components/loading/Loading";
import { isDocument } from "@testing-library/user-event/dist/utils";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = UserAuth();

  useEffect(() => {
    if (user) {
      getCartItems();
    }
  }, [user]);

  useEffect(() => {
    return;
  }, [cartItems]);

  const getCartItems = async () => {
    setIsLoading(true);
    const q = doc(db, "cart", `${user?.uid}`);
    const querySnapshot = await getDoc(q);
    const res = querySnapshot.data();
    setCartItems((prev) => [...prev, ...res.meals_id]);
    setIsLoading(false);
  };

  const addToCart = async (id) => {
    setCartItems((prev) => [...prev, { id, quantity: 1 }]);
    const cartRef = doc(db, "cart", `${user?.uid}`);

    await updateDoc(cartRef, { meals_id: [...cartItems, { id, quantity: 1 }] });
  };

  const removeFromCart = async (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    const docRef = doc(db, "cart", `${user?.uid}`);

    await updateDoc(docRef, {
      meals_id: cartItems.filter((item) => item.id !== id),
    });
  };

  const increaseQuantity = async (id) => {
    const newArray = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    const docRef = doc(db, "cart", `${user?.uid}`);
    await updateDoc(docRef, {
      meals_id: newArray,
    });
    setCartItems(newArray);
  };

  const decreaseQuantity = async (id) => {
    for (const item of cartItems) {
      if (item.id === id) {
        if (item.quantity === 1) {
          removeFromCart(id);
        } else {
          const newArray = cartItems.map((obj) => {
            if (obj.id === id) {
              return { ...obj, quantity: obj.quantity - 1 };
            }
            return obj;
          });

          const docRef = doc(db, "cart", `${user?.uid}`);
          await updateDoc(docRef, {
            meals_id: newArray,
          });
          setCartItems(newArray);
        }
      }
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        isLoading,
        increaseQuantity,
        decreaseQuantity,
        setCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const CartFunctionality = () => {
  return useContext(CartContext);
};
