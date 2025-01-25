import React, { useEffect, useState } from "react";
import "./headerAccount.css";
import { signOut } from "../../../api/userAPI";
import { useNavigate } from "react-router-dom";
import { getRoleFromToken } from "../../../helpers/authHelpers";
import { faBell, faHotel, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getAllNotificationWithUser,
  markAllAsRead,
  markAsRead,
} from "../../../api/notificationAPI";
import socketService from "../../../helpers/sockerService";
import { refreshAccessToken } from "../../../api/sessionAPI";

function HeaderAccount() {
  const isSignIn = localStorage.getItem("isSignIn");
  const userName = localStorage.getItem("userDisplayName");
  const userId = localStorage.getItem("userId");
  const [notifications, setNotifications] = useState();
  const [totalUnseen, setTotalUnseen] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const handleNavigate = () => {
    const role = getRoleFromToken(accessToken, "Partner");
    if (role) {
      navigate(`/partner/propertyList/${userId}`);
    } else {
      navigate("/partner/partnerDashboard");
    }
  };
  const fetchNotifications = async () => {
    const { noti, unseen } = await getAllNotificationWithUser(userId);
    setNotifications(noti);
    setTotalUnseen(unseen);
  };
  const getAllNotification = async () => {
    const data = await getAllNotificationWithUser(userId);
    setNotifications(data.noti);
    setTotalUnseen(data.unseen);
  };
  const handleMarkAllAsRead = async (userId) => {
    await markAllAsRead(userId);
    fetchNotifications();
  };

  useEffect(() => {
    getAllNotification();
    const id = localStorage.getItem("userId");
    const adminRole = getRoleFromToken(accessToken, "Admin");
    setIsAdmin(adminRole);

    if (id) {
      socketService.on("notifyPartner", (notification) => {
        getAllNotification()
        console.log("Notification received in HeaderAccount:", notification);
        fetchNotifications();
      });
      socketService.on("notifyUser", (notification) => {
        getAllNotification()
        console.log("Notification received in HeaderAccount - ToUser:", notification);
      })
    }
    return () => {
      if (id) {
        socketService.off("notifyPartner");
        socketService.off('notifyUser');
      }
    };
  }, []);

  const handleRefreshToken = async () => {
    const refToken = await refreshAccessToken();

    console.log(refToken);

    localStorage.setItem("userId", refToken._id);
    localStorage.setItem("accessToken", refToken.access_token);

    console.log(localStorage.getItem("accessToken"));

    window.location.reload();


  }


  const handleSignOut = async () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userDisplayName");
    localStorage.removeItem("isSignIn");
    localStorage.removeItem("email");
    localStorage.removeItem("unfinishedBooking");
    localStorage.removeItem("reservationInfo");
    await signOut(userId);
    window.location.reload();
  };
  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    fetchNotifications();
  };

  return (
    <div className="headerAccountContainer">
      <span className="listProperty" onClick={handleNavigate}>
        List your property
      </span>
      <>
        <div className="display-flex">
          <div
            className="notification-wrapperr"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <FontAwesomeIcon
              style={{
                marginRight: "30px",
              }}
              icon={faBell}
              className="notification-iconn"
            />
            {totalUnseen > 0 && (
              <span
                style={{
                  marginRight: "32px",
                }}
                className="notification-badgee"
              >
                {totalUnseen}
              </span>
            )}
          </div>
        </div>

        {showDropdown && (
          <div
            style={{
              marginTop: "170px",
            }}
            className="notification-dropdownn"
          >
            <div className="dropdown-headerr">
              <h4>Thông báo</h4>
              <button
                className="mark-all-readd"
                onClick={() => handleMarkAllAsRead(userId)}
              >
                Đánh dấu tất cả đã đọc
              </button>
            </div>
            <div className="dropdown-bodyy">
              {notifications.length === 0 ? (
                <p
                  style={{
                    marginLeft: "3%",
                  }}
                >
                  Không có thông báo nào
                </p>
              ) : (
                notifications.map((notif, index) => { return (
                  <div
                    key={index}
                    className={`notification-itemm ${
                      notif.status === false ? "unreadd" : "readd"
                    }`}
                  >
                    <p>{notif.message}</p>
                    <small>{new Date(notif.created_at).toLocaleString()}</small>
                    {notif.type === "Partner" ? (
                      <button
                        className="mark-readd"
                        onClick={async () => {await handleMarkAsRead(notif._id); handleRefreshToken(); }}
                      >
                        Click To become Partner
                      </button>
                    ) : (
                      !notif.status && (
                        <button
                          className="mark-readd"
                          onClick={() => handleMarkAsRead(notif._id)}
                        >
                          Đánh dấu đã đọc
                        </button>
                      )
                    )}
                  </div>
                )})
              )}
            </div>
          </div>
        )}
      </>
      {isAdmin && (
        <div className="admin-icon" onClick={() => navigate("/admin")}>
          <FontAwesomeIcon icon={faUserTie} />
        </div>
      )}
      <span className="userName-account">{"Hello, " + userName}</span>
      <button onClick={handleSignOut} className="signOutButton">
        Sign Out
      </button>
    </div>
  );
}

export default HeaderAccount;
