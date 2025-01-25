import React, { useEffect, useState } from "react";
import "./PropertyListPage.css";
import "../partnerRegister/PropertyDetailsForm.css";
import {
  deletePropertyById,
  getPropertyByOwner,
} from "../../../api/propertyAPI";
import { useNavigate, useParams } from "react-router-dom";
import PropertyDetailsForm from "../partnerRegister/PropertyDetailsForm";
import SearchBar from "./Components/SearchBar";
import PartnerNavbar from "../partnerNavbar/partnerNavbar";
import DashboardPage from "../partnerDashboard/DashboardPage";
import Loading from "../../loading/Loading";
import PartnerBookingDashboard from "../partnerBooking/PartnerBookingDashboard";

const PropertyListPage = () => {
  const [properties, setProperties] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [propertyToEdit, setPropertyToEdit] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const propertiesPerPage = 5;
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [activeTab, setActiveTab] = useState("list");
  const longitude = localStorage.getItem("longitude");
  const latitude = localStorage.getItem("latitude");
  const userId = localStorage.getItem("userId");
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const response = await getPropertyByOwner(
          id,
          currentPage,
          propertiesPerPage,
        );

        if (response) {
          setIsLoading(false);
          setProperties(response.properties);
          setTotalPages(response.totalPages);
        }
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      }
    };
    fetchProperties();
  }, [id, currentPage]);
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleDelete = async (propertyId) => {
    try {
      const newProperties = await deletePropertyById(
        propertyId,
        userId,
        currentPage,
        5,
      );

      setProperties(newProperties.properties);
      setTotalPages(newProperties.totalPages);
      alert("Xóa bất động sản thành công!");
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  };
  const handleEdit = (property) => {
    // Kiểm tra để tránh set state lặp đi lặp lại
    if (!propertyToEdit || propertyToEdit._id !== property._id) {
      setPropertyToEdit(property);
      setActiveTab("edit");
    }
  };
  const handleSearch = ({ type, value }) => {
    const filtered = properties.filter((property) => {
      if (type === "name") {
        return property.property.name.includes(value);
      } else if (type === "address") {
        return (
          property.property.address.street.includes(value) ||
          property.property.address.ward.includes(value) ||
          property.property.address.district.includes(value) ||
          property.property.address.province.includes(value)
        );
      } else if (type === "roomType") {
        return property.property.type.includes(value);
      }
      return true;
    });

    setFilteredProperties(filtered);
  };
  const renderListTab = () => (
    <>
      <div className="table-header">
        <SearchBar onSearch={handleSearch} />
        <div className="pagination-controls">
          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <div className="property-table-container">
        {isLoading ? (
          <Loading />
        ) : (
          <table className="property-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên</th>
                <th>Địa chỉ</th>
                <th>Loại</th>
                <th>Số phòng</th>
                <th>Rate</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.length !== 0
                ? filteredProperties.map((property) => (
                    <tr key={property.property._id}>
                      <td>
                        <img
                          src={
                            property.property.images[0] ||
                            "default-image-url.jpg"
                          }
                          alt="Property"
                          className="property-image-thumbnail"
                        />
                      </td>
                      <td>{property.property.name}</td>
                      <td
                        style={{
                          width: "20%",
                        }}
                      >{`${property.property.address.street}, ${property.property.address.ward}, ${property.property.address.district}, ${property.property.address.province}`}</td>
                      <td>{property.property.type}</td>
                      <td>{property.totalRoom || 0}</td>
                      <td>{property.property.rate || 0}</td>

                      <td
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "32px 10px",
                        }}
                      >
                        <button
                          className="view-details-button"
                          onClick={() =>
                            navigate(
                              `/partner/partnerPropertyDetailPage/${property.property._id}`,
                            )
                          }
                        >
                          Xem Chi Tiết
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(property.property._id)}
                        >
                          Xóa
                        </button>

                      </td>
                    </tr>
                  ))
                : properties.map((property) => (
                    <tr key={property.property._id}>
                      <td>
                        <img
                          src={
                            property.property.images[0] ||
                            "default-image-url.jpg"
                          }
                          alt="Property"
                          className="property-image-thumbnail"
                        />
                      </td>
                      <td>{property.property.name}</td>
                      <td
                        style={{
                          width: "20%",
                        }}
                      >{`${property.property.address.street}, ${property.property.address.ward}, ${property.property.address.district}, ${property.property.address.province}`}</td>
                      <td>{property.property.type}</td>
                      <td>{property.totalRoom || 0}</td>
                      <td>{property.property.rate || 0}</td>

                      <td
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "32px 10px",
                        }}
                      >
                        <button
                          className="view-details-button"
                          onClick={() => {
                            navigate(
                              `/partner/partnerPropertyDetailPage/${property.property._id}`,
                            );
                          }}
                        >
                          Xem Chi Tiết
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(property.property._id)}
                        >
                          Xóa
                        </button>

                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
  const renderEditTab = () => (
    <div className="property-add-edit">
      {/* Chỉ render PropertyDetailsForm khi có `propertyToEdit` */}
      {propertyToEdit && <PropertyDetailsForm initialData={propertyToEdit} />}
    </div>
  );

  const renderAddTab = () => (
    <div className="new-container">
      <PropertyDetailsForm
        longitude={longitude}
        latitude={latitude}
        initialData={propertyToEdit}
        setActiveTab={setActiveTab}
      />
    </div>
  );

  return (
    <div className="property-list-page">
      <h2
        style={{
          marginLeft: "16%",
        }}
      >
        Quản Lý Bất Động Sản
      </h2>
      <div
        className="tabs"
        style={{
          marginLeft: "16%",
        }}
      >
        <button
          className={`tab-button ${activeTab === "info" ? "active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          Thông tin
        </button>
        <button
          className={`tab-button ${activeTab === "list" ? "active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          Danh Sách
        </button>
        <button
          className={`tab-button ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          Thêm Mới
        </button>
        <button
          className={`tab-button ${activeTab === "booking" ? "active" : ""}`}
          onClick={() => setActiveTab("booking")}
        >
          Booking
        </button>
      </div>
      {activeTab === "info" && <DashboardPage />}

      {activeTab === "list" && renderListTab()}
      {activeTab === "add" && renderAddTab()}
      {activeTab === "edit" && renderEditTab()}
      {activeTab === "booking" && <PartnerBookingDashboard />}
    </div>
  );
};

export default PropertyListPage;
