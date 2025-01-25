import React, { useState } from "react";
import "../PropertyListPage.css";
const SearchBar = ({ onSearch }) => {
  const [searchType, setSearchType] = useState("name"); // Kiểu thông tin cần tìm
  const [searchValue, setSearchValue] = useState(""); // Giá trị tìm kiếm

  // Hàm xử lý sự kiện khi người dùng bấm tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    // Thực hiện tìm kiếm ngay lập tức khi giá trị thay đổi
    onSearch({ type: searchType, value });
  };

  return (
    <div className="search-bar">
      <select
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        className="search-select"
      >
        <option value="name">Tên</option>
        <option value="address">Địa chỉ</option>
        <option value="roomType">Loại Phòng</option>
      </select>

      <input
        type="text"
        placeholder={`Tìm kiếm theo ${searchType}`}
        value={searchValue}
        onChange={handleSearchChange}
        className="search-input"
      />
    </div>
  );
};
export default SearchBar;
