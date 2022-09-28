import DashboardSidebar from "../../../components/dashboard-sidebar/DashboardSidebar";
import "./index.css";

function Index() {
  return (
    <div className="dashboard-container">
      <DashboardSidebar active="home" />
      <div className="dashboard-content">Index</div>
    </div>
  );
}

export default Index;
