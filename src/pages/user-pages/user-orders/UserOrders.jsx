import DashboardSidebar from "../../../components/dashboard-sidebar/DashboardSidebar";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "./userorders.css";
import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { UserAuth } from "../../../contexts/AuthContext";

function Orders() {
  const [rows, setRows] = useState([]);
  const { user } = UserAuth();

  useEffect(() => {
    const colRef = collection(db, "orders");

    const unsub = onSnapshot(colRef, (snapshot) => {
      setRows([]);
      snapshot.docs.forEach((doc) => {
        const res = doc.data();
        const resMealsArray = doc.data().order_meals;
        const orderTime = new Date(doc.data().created_at.seconds * 1000);

        if (res.user_id === user?.uid) {
          const orderData = {
            id: doc.id,
            meals: resMealsArray,
            user_id: res.user_id,
            total: res.total,
            created_at: orderTime,
            status: res.order_status,
          };

          setRows((prev) =>
            [...prev, orderData].sort((a, b) => b.created_at - a.created_at)
          );
        }
      });
    });

    return unsub;
  }, []);

  return (
    <div className="user-orders-container">
      <h2 className="user-orders-title">Your Orders</h2>
      <TableContainer
        sx={{ width: "calc(100vw - 4rem)", minWidth: 650, margin: "2rem auto" }}
        component={Paper}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="left">Ordered At</TableCell>
              <TableCell align="left">Total</TableCell>
              <TableCell align="left">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.meals.map((meal) => (
                    <div key={meal.id} className="order-table-meals-list">
                      <img src={meal.image} alt="order meal" />
                      <p>{meal.name}</p>
                    </div>
                  ))}
                </TableCell>
                <TableCell align="left">
                  {row.created_at.toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  . {row.created_at.toLocaleTimeString("en-GB")}
                </TableCell>
                <TableCell align="left">
                  <p className="total-bold-text">{row.total.toFixed(2)} $</p>
                </TableCell>
                <TableCell align="left">
                  <p className={row.status}>{row.status}</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Orders;
