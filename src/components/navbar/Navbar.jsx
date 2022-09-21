import { useState } from "react";
import "./navbar.css";
import Signup from "../signup/Signup";
import Login from "../login/Login";

import CloseIcon from "@mui/icons-material/Close";

const Navbar = () => {
  const [modalType, setModalType] = useState("");
  const [showModal, setShowModal] = useState(false);

  function toggleSignUp() {
    setModalType("signup");
    setShowModal(true);
  }

  function toggleLogin() {
    setModalType("login");
    setShowModal(true);
  }

  return (
    <div className="navbar-container">
      <div className="navbar-left">Foodspace</div>
      <div className="navbar-right">
        {/*

        This will be only shown  if user is loged in

        <ul>
          <li>
            <a href="#">My Profile</a>
          </li>
          <li>
            <a href="#">My Orders</a>
          </li>
          <li>
            <a href="#">Cart</a>
          </li>
          <li>
            <a href="#">Dashboard</a>
          </li>
          <li>
            <a href="#">Logout</a>
          </li>

        </ul> */}

        <ul>
          <li onClick={() => toggleLogin()}>Login</li>
          <li onClick={() => toggleSignUp()} className="navbar-signup-btn">
            Sign up
          </li>
        </ul>
      </div>

      {showModal ? (
        <div className="show-modal">
          <CloseIcon
            onClick={() => setShowModal(false)}
            className="close-modal"
          />
          {modalType === "signup" ? (
            <Signup />
          ) : modalType === "login" ? (
            <Login />
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Navbar;
