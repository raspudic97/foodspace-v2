import DashboardSidebar from "../../../components/dashboard-sidebar/DashboardSidebar";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import "./orders.css";
import { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, onSnapshot } from "firebase/firestore";

const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "user", label: "User", minWidth: 100 },
  {
    id: "address",
    label: "Address",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "price",
    label: "Price",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "actions",
    label: "Actions",
    minWidth: 170,
    align: "right",
    format: (value) => value.toFixed(2),
  },
];

const rows = [];

function createData(id, photo, name, user, address, price, action) {
  return { id, photo, name, user, address, price, action };
}

function Orders() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orders, setOrders] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    const colRef = collection(db, "orders");

    const unsub = onSnapshot(colRef, (snapshot) => {
      snapshot.docs.forEach((doc) => {
        // What to do after snapshot gets data
      });
    });

    return unsub;
  }, [rows]);

  return (
    <div className="dashboard-container">
      <DashboardSidebar active="orders" />
      <div className="dashboard-content">
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: "calc(100vh - 56px - 4rem)" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.address}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
}

export default Orders;
