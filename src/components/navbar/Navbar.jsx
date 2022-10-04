import { useNavigate, Link } from "react-router-dom";
import "./navbar.css";
import DefaultProfilePic from "../../assets/default-profile-picture.png";
import Signup from "../signup/Signup";
import Login from "../login/Login";
import CloseIcon from "@mui/icons-material/Close";
import { UserAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const { modalType, setModalType } = UserAuth();
  const { showModal, setShowModal } = UserAuth();
  const { showDropdown, setShowDropdown } = UserAuth();
  const { user, logout, userFromFirestore } = UserAuth();
  const navigate = useNavigate();

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
      <div onClick={() => navigate("/order")} className="navbar-left">
        Foodspace
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <div
              onClick={() => setShowDropdown((prev) => !prev)}
              className="navbar-parent-link"
            >
              <p className="navbar-parent-username">{user.displayName}</p>
              <img
                className="navbar-parent-profile-pic"
                src={DefaultProfilePic}
                alt="profile"
              />
            </div>

            {showDropdown ? (
              <ul className="navbar-dropdown">
                <li>
                  <a href="#">My Profile</a>
                </li>
                <li>
                  <a href="#">Orders</a>
                </li>
                <li>
                  <Link to="/cart">Cart</Link>
                </li>
                {userFromFirestore?.role === "admin" ? (
                  <li>
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                ) : (
                  ""
                )}
                <li
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  <a>Logout</a>
                </li>
              </ul>
            ) : (
              ""
            )}
          </>
        ) : (
          <ul>
            <li onClick={() => toggleLogin()}>Login</li>
            <li onClick={() => toggleSignUp()} className="navbar-signup-btn">
              Sign up
            </li>
          </ul>
        )}
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
