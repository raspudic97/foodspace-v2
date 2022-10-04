import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Homepage from "./pages/homepage/Homepage";
import { AuthProvider } from "./contexts/AuthContext";
import AdminOnly from "./protectedRoutes/AdminOnly";
import Index from "./pages/dashboard-pages/index/Index";
import Users from "./pages/dashboard-pages/users/Users";
import Orders from "./pages/dashboard-pages/orders/Orders";
import Meals from "./pages/dashboard-pages/meals/Meals";
import NewMeal from "./pages/dashboard-pages/newMeal/NewMeal";
import Order from "./pages/order/Order";
import { CartProvider } from "./contexts/CartContext";
import Cart from "./pages/cart/Cart";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
          <Navbar />

          <Routes>
            <Route path="/" exact element={<Homepage />} />
            <Route path="/order" exact element={<Order />} />
            <Route path="/cart" exact element={<Cart />} />
            <Route path="/dashboard">
              <Route
                index
                element={
                  <AdminOnly>
                    <Index />
                  </AdminOnly>
                }
              />
              <Route path="users">
                <Route
                  index
                  element={
                    <AdminOnly>
                      <Users />
                    </AdminOnly>
                  }
                />
                <Route path=":userId" element={<div>Single User</div>} />
              </Route>
              <Route path="orders">
                <Route
                  index
                  element={
                    <AdminOnly>
                      <Orders />
                    </AdminOnly>
                  }
                />
                <Route path=":orderId" element={<div>Single Order</div>} />
              </Route>
              <Route path="meals">
                <Route
                  index
                  element={
                    <AdminOnly>
                      <Meals />
                    </AdminOnly>
                  }
                />
                <Route path=":productId" element={<div>Single Meal</div>} />
                <Route path="new" element={<NewMeal />} />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
