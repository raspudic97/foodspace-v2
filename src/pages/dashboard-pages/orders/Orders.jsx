import DashboardSidebar from "../../../components/dashboard-sidebar/DashboardSidebar";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "./orders.css";
import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

function Orders() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "orders");

    const unsub = onSnapshot(colRef, (snapshot) => {
      setRows([]);
      snapshot.docs.forEach((doc) => {
        const res = doc.data();
        const resMealsArray = doc.data().order_meals;
        const orderTime = new Date(doc.data().created_at.seconds * 1000);

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
      });
    });

    return unsub;
  }, []);

  const handleAction = async (id, action) => {
    const orderRef = doc(db, "orders", `${id}`);

    console.log(action);

    await updateDoc(orderRef, { order_status: `${action}` });
  };

  return (
    <div className="dashboard-container">
      <DashboardSidebar active="orders" />
      <div className="dashboard-content">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Name</TableCell>
                <TableCell align="center">Ordered At</TableCell>
                <TableCell align="center">Total</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="left" component="th" scope="row">
                    {row.meals.map((meal) => (
                      <div key={meal.id} className="order-table-meals-list">
                        <img src={meal.image} alt="order meal" />
                        <p>{meal.name}</p>
                      </div>
                    ))}
                  </TableCell>
                  <TableCell align="center">
                    {row.created_at.toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    . {row.created_at.toLocaleTimeString("en-GB")}
                  </TableCell>
                  <TableCell align="center">
                    <p className="total-bold-text">{row.total} $</p>
                  </TableCell>
                  <TableCell align="center">
                    <p className={row.status}>{row.status}</p>
                  </TableCell>
                  <TableCell sx={{ minWidth: 170 }} align="center">
                    {row.status === "pending" ? (
                      <div className="orders-actions-container">
                        <button
                          onClick={() => handleAction(row.id, "accepted")}
                          className="accept-btn"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(row.id, "declined")}
                          className="decline-btn"
                        >
                          Decline
                        </button>
                      </div>
                    ) : row.status === "accepted" ? (
                      <div className="orders-actions-container">
                        <button
                          onClick={() => handleAction(row.id, "delivering")}
                          className="delivering-btn"
                        >
                          Set order status to: "Delivering"
                        </button>
                      </div>
                    ) : row.status === "delivering" ? (
                      <div className="orders-actions-container">
                        <button
                          onClick={() => handleAction(row.id, "delivered")}
                          className="delivered-btn"
                        >
                          Finish order (Delivered)
                        </button>
                      </div>
                    ) : row.status === "declined" ? (
                      <div className="orders-actions-container">
                        <p className="order-status-no-action">
                          You declined this order
                        </p>
                      </div>
                    ) : row.status === "delivered" ? (
                      <div className="orders-actions-container">
                        <p className="order-status-no-action">
                          This order has been delivered
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Orders;
