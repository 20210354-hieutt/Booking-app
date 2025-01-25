import React, { useEffect, useState } from "react";
import "./reservationRoom_items.css";
import { formatCurrency } from "../../../helpers/currencyHelpers";
import { calculateTotalNightPriceForReservation } from "../../../api/bookingAPI";
import { FaUser, FaChild } from "react-icons/fa";
import { useLocation } from "react-router-dom";

function ReservationRoom_item({
  room,
  totalPrice,
  numberOfNights,
  setTotalPrice,
  setSelectedRoom,
  selectedRoom,
  setIsModalOpen,
  setModalRoom,
}) {
  const handleRoomClick = () => {
    setIsModalOpen(true);
    setModalRoom(room);
  };

  const check_in_date = JSON.parse(localStorage.getItem("option")).check_in;
  const check_out_date = JSON.parse(localStorage.getItem("option")).check_out;
  const [showNumberOfRoom, setShowNumberOfRoom] = useState(false);
  const [numberOfRoom, setNumberOfRoom] = useState([0]);
  let rooms = JSON.parse(localStorage.getItem("option")).capacity.room;
  const totalRoomsSelected = selectedRoom.reduce(
    (acc, room) => acc + room.numberOfRooms,
    0,
  );
  const handleSelectedRoom = (value, name) => {
    const numberOfRooms = Number(value);

    if (numberOfRooms > rooms) {
      alert(`Bạn chỉ có thể chọn tối đa ${rooms} phòng.`);
      return;
    }
    setSelectedRoom((prev) => {
      const existingRoomIndex = prev.findIndex((room) => room.roomId === name);
      if (existingRoomIndex !== -1) {
        if (value === 0) {
          return prev.filter((room) => room.roomId !== name);
        }
        if (numberOfRooms > prev[existingRoomIndex].numberOfRooms) {
          const updatedSelectedRooms = prev.map((room, index) =>
            index === existingRoomIndex
              ? { ...room, numberOfRooms: value }
              : room,
          );

          rooms = rooms - (value - prev[existingRoomIndex].numberOfRooms);

          return updatedSelectedRooms;
        } else {
          return prev.map((room, index) =>
            index === existingRoomIndex
              ? { ...room, numberOfRooms: value }
              : room,
          );
        }
      } else {
        if (value === 0) {
          return prev.filter((room) => room.roomId !== name);
        }
        return [
          ...prev,
          {
            roomId: name,
            numberOfRooms: value,
          },
        ];
      }
    });
    setShowNumberOfRoom(false);
  };
  useEffect(() => {
    if (rooms >= 0 && !numberOfRoom.includes(rooms)) {
      const updatedRooms = Array.from(
        { length: rooms + 1 },
        (_, index) => index,
      );
      setNumberOfRoom(updatedRooms);
    }
  }, []);

  const getSelectedRoomCount = (roomId) => {
    const selectedRoomItem = selectedRoom.find(
      (room) => room.roomId === roomId,
    );

    return selectedRoomItem ? selectedRoomItem.numberOfRooms : 0;
  };
  useEffect(() => {
    const calculateTotalNightPrice = async () => {
      const response = await calculateTotalNightPriceForReservation(
        selectedRoom,
        check_in_date,
        check_out_date,
      );
      setTotalPrice(response);
    };
    calculateTotalNightPrice();
    console.log(selectedRoom);
  }, [selectedRoom]);
  return (
    <tr key={room._id}>
      <td>
        <div className="roomName">
          <a
            href="#"
            className="name"
            onClick={(e) => {
              e.preventDefault();
              handleRoomClick();
            }}
          >
            {room.name}
          </a>
          <span className="type">{room.type}</span>
        </div>
      </td>
      <td>{room.rating}</td>
      <td>
        {Array.from({ length: room.capacity.adults }, (_, index) => (
          <FaUser key={index} />
        ))}
        +
        {Array.from({ length: room.capacity.childs.count }, (_, index) => (
          <FaChild key={index} />
        ))}
      </td>
      <td>
        <div className="price">
          <span className="original-price">{room.originalPrice}</span>
          <span className="discounted-price">{formatCurrency(totalPrice)}</span>
        </div>
      </td>
      <td>
        <div className="roomDropdown">
          <div
            className="selectedRoom"
            onClick={() => setShowNumberOfRoom(!showNumberOfRoom)}
          >
            {getSelectedRoomCount(room._id) > 0
              ? `${getSelectedRoomCount(room._id)}`
              : "Chọn số phòng"}
          </div>
          {showNumberOfRoom && numberOfRoom && (
            <div className="numberRoomDropdown">
              {numberOfRoom.map((number) => {
                const isDisabled =
                  totalRoomsSelected - getSelectedRoomCount(room._id) + number >
                  rooms;
                return (
                  <div
                    key={number}
                    className={`roomItem ${isDisabled ? "disabled" : ""}`}
                    onClick={() => {
                      // Cho phép chọn khi không bị disable
                      if (!isDisabled) {
                        handleSelectedRoom(number, room._id);
                      }
                    }}
                  >
                    {number}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

export default ReservationRoom_item;
