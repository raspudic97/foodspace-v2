import DashboardSidebar from "../../../components/dashboard-sidebar/DashboardSidebar";
import "./users.css";

function Users() {
  return (
    <div className="dashboard-container">
      <DashboardSidebar active="users" />
      <div className="dashboard-content">Users</div>
    </div>
  );
}

export default Users;
