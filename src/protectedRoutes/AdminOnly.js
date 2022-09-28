import { Navigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import Loading from "../components/loading/Loading";

const AdminOnly = ({ children }) => {
  const { userFromFirestore } = UserAuth();

  while (userFromFirestore === null) {
    return <Loading />;
  }

  if (userFromFirestore?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminOnly;
