import React, { useEffect, useState } from "react";
import "./partnerNavbar.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import socketService from "../../../helpers/sockerService";
import {
  getAllNotificationWithUser,
  markAllAsRead,
  markAsRead,
} from "../../../api/notificationAPI";

function PartnerNavbar() {
  const isSignIn = localStorage.getItem("isSignIn");
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const userId = localStorage.getItem("userId");
  const userDisplayName = localStorage.getItem("userDisplayName");
  const [notifications, setNotifications] = useState();
  const [totalUnseen, setTotalUnseen] = useState(0);
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
  useEffect(() => {
    getAllNotification();
    socketService.on("notifyPartner", (notification) => {
      console.log("Notification received:", notification);
      fetchNotifications();
    });
  }, []);
  const handleMarkAllAsRead = async (userId) => {
    await markAllAsRead(userId);
    fetchNotifications();
  };

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    fetchNotifications();
  };
  return (
    <div className="navbarr">
      <div className="navContainer">
        <a href="/">
          <span className="logo">Booking-app</span>
        </a>

        <div className="navItemss">
          {isSignIn ? (
            <>
              <div className="display-flex">
                <div
                  className="notification-wrapper"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <FontAwesomeIcon
                    icon={faBell}
                    className="notification-icon"
                  />
                  {totalUnseen > 0 && (
                    <span className="notification-badge">{totalUnseen}</span>
                  )}
                </div>
                <p>Xin chào {userDisplayName}</p>
              </div>

              {/* Dropdown danh sách thông báo */}
              {showDropdown && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">
                    <h4>Thông báo</h4>
                    <button
                      className="mark-all-read"
                      onClick={() => handleMarkAllAsRead(userId)}
                    >
                      Đánh dấu tất cả đã đọc
                    </button>
                  </div>
                  <div className="dropdown-body">
                    {notifications.length === 0 ? (
                      <p>Không có thông báo nào</p>
                    ) : (
                      notifications.map((notif, index) => (
                        <div
                          key={index}
                          className={`notification-item ${
                            notif.status === false ? "unread" : "read"
                          }`}
                        >
                          <p>{notif.message}</p>
                          <small>
                            {new Date(notif.created_at).toLocaleString()}
                          </small>
                          {!notif.status && (
                            <button
                              className="mark-read"
                              onClick={() => handleMarkAsRead(notif._id)}
                            >
                              Đánh dấu đã đọc
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <h1></h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default PartnerNavbar;
