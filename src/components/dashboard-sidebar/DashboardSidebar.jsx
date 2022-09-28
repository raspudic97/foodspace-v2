import { Link } from "react-router-dom";
import "./dashboardSidebar.css";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import RestaurantIcon from "@mui/icons-material/Restaurant";

function DashboardSidebar({ active }) {
  return (
    <div className="dashboard-sidebar-container">
      <ul className="sidebar-links">
        <li>
          <Link
            className={active === "home" ? "active-tab" : ""}
            to={"/dashboard"}
            replace
          >
            <HomeIcon />
            <span>Homepage</span>
          </Link>
        </li>
        <li>
          <Link
            className={active === "orders" ? "active-tab" : ""}
            to={"/dashboard/orders"}
            replace
          >
            <LocalMallIcon />
            <span>Orders</span>
          </Link>
        </li>
        <li>
          <Link
            className={active === "users" ? "active-tab" : ""}
            to={"/dashboard/users"}
            replace
          >
            <GroupIcon />
            <span>Users</span>
          </Link>
        </li>
        <li>
          <Link
            className={active === "meals" ? "active-tab" : ""}
            to={"/dashboard/meals"}
            replace
          >
            <RestaurantIcon />
            <span>Meals</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default DashboardSidebar;
