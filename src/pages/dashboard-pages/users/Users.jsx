import DashboardSidebar from "../../../components/dashboard-sidebar/DashboardSidebar";
import "./users.css";
import { db } from "../../../firebase";
import { deleteUser } from "firebase/auth";
import { useEffect, useState } from "react";
import DefaultProfilePic from "../../../assets/default-profile-picture.png";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { collection, query, getDocs, deleteDoc, doc } from "firebase/firestore";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#333",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const q = query(collection(db, "users"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const res = { ...doc.data() };
      setUsers((prev) => [...prev, res]);
    });
  }

  return (
    <div className="dashboard-container">
      <DashboardSidebar active="users" />
      <div className="dashboard-content">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Profile Photo</StyledTableCell>
                <StyledTableCell align="left">Username</StyledTableCell>
                <StyledTableCell align="left">Email</StyledTableCell>
                <StyledTableCell align="left">Address</StyledTableCell>
                <StyledTableCell align="left">Total orders</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    <img
                      className="meal-table-img"
                      src={
                        row.profile_photo_url !== ""
                          ? row.profile_photo_url
                          : DefaultProfilePic
                      }
                      alt="meal"
                    />
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.username}</StyledTableCell>
                  <StyledTableCell align="left">{row.email}</StyledTableCell>
                  <StyledTableCell align="left">{row.address}</StyledTableCell>
                  <StyledTableCell align="left">150 $</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Users;
