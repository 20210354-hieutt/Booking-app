import React from "react";
import RoomModal_image from "./roomModal_image"; // Import the image component
import "./roomModal.css"; // Optional for styling

const RoomModal = ({ isOpen, onClose, room }) => {
  if (!isOpen) return null;

  return (
    room && (
      <div className="modalRoom-overlay" onClick={onClose}>
        <div className="modalRoom-content" onClick={(e) => e.stopPropagation()}>
          <div>
            <h2>{room.name}</h2>
            <div className="close">
              <button onClick={onClose}>x</button>
            </div>
          </div>
          <div>
            <div className="image">
              <RoomModal_image images={room.images} />
            </div>
            <div className="info">
              <table className="info-table">
                <tbody>
                  <tr>
                    <td>Type:</td>
                    <td>
                      <b>{room.type}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>Rating:</td>
                    <td>
                      <b>{room.rating}</b>
                    </td>
                  </tr>
                  <tr>
                    <td>Capacity:</td>
                    <td>
                      <b>{room.capacity.room} guests</b>
                    </td>
                  </tr>
                  <tr>
                    <td>Price per Night:</td>
                    <td>
                      <span
                        className={
                          room.price_per_night.weekday <
                          room.price_per_night.weekend
                            ? "lowerPrice-text"
                            : ""
                        }
                      >
                        <b>{room.price_per_night.weekday} (Weekday)</b>
                      </span>
                      <b>/</b>
                      <span
                        className={
                          room.price_per_night.weekend <
                          room.price_per_night.weekday
                            ? "lowerPrice-text"
                            : ""
                        }
                      >
                        <b>{room.price_per_night.weekend} (Weekend)</b>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <h4>Facilities</h4>
              <ul>
                {room.facility.map(
                  (item, index) => item && <li key={index}>{item}</li>, // Only display non-empty facilities
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default RoomModal;
