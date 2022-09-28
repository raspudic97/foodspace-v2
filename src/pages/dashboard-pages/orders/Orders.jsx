import DashboardSidebar from "../../../components/dashboard-sidebar/DashboardSidebar";
import "./orders.css";

function Orders() {
  return (
    <div className="dashboard-container">
      <DashboardSidebar active="orders" />
      <div className="dashboard-content">Orders</div>
    </div>
  );
}

export default Orders;
