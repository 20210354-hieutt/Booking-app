import SideBar from "./component/SideBar/SideBar";
import "./AdminDashboard.css";
import { Outlet } from "react-router-dom";
import { getRoleFromToken } from "../../helpers/authHelpers";
import Error from "../../componets/404/404Page";

function AdminDashboard() {
  const accessToken = localStorage.getItem('accessToken')
  const isAdmin = getRoleFromToken(accessToken, 'Admin')
  return (
    <>
      {
        isAdmin ? (
          <div className="AdminDashboard">
      <div className="DashboardGlass">
        <SideBar />
        <Outlet />
      </div>
    </div>
        ) : (
          <Error/>
        )
      }
    </>
  );
}

export default AdminDashboard;
