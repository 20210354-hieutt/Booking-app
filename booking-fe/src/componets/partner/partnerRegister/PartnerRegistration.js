import React, { useEffect, useState } from "react";
import "./PartnerRegistration.css";
import { requestToPartner, updatePartnerAccount } from "../../../api/userAPI";
import { Modal, Button } from "react-bootstrap";
import { getProvince } from "../../../api/addressAPI";
import PropertyDetailsForm from "./PropertyDetailsForm";
import { useNavigate } from "react-router-dom";

const PartnerRegistration = ({ existedUser }) => {
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    street: "",
    province: "",
    district: "",
    ward: "",
    propertyType: "",
    numberOfProperties: "",
  });
  const [address, setAddress] = useState();
  const [district, setDistrict] = useState();
  const [ward, setWard] = useState();
  const navigate = useNavigate();
  const [street, setStreet] = useState();
  const longitude = localStorage.getItem("longitude");
  const latitude = localStorage.getItem("latitude");
  const [showModal, setShowModal] = useState(false);
  const handleGetAddress = async () => {
    const respone = await getProvince();
    setAddress(respone);
  };
  const getDistrict = async (code) => {
    const findDistrict = address.find((index) => index.code === parseInt(code));

    setDistrict(findDistrict.districts);
  };
  const getWard = async (code) => {
    const findWard = district.find((index) => index.code === parseInt(code));
    console.log(findWard);

    setWard(findWard?.wards);
  };
  useEffect(() => {
    handleGetAddress();
  }, []);
  const [isRegistered, setIsRegistered] = useState(false);
  const handleChangeOptions = async (e) => {
    const { name, value } = e.target;
    const selectedOptions = e.target.options[e.target.selectedIndex];
    const code = selectedOptions.getAttribute("data-code");

    if (name === "province") {
      await getDistrict(code);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "district") {
      await getWard(code);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else if (name === "ward") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  const handleChange = async (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existedUser) {
      await requestToPartner(existedUser._id);
    }
    setShowModal(true);
  };
  const handleCloseModal = async () => {
    setShowModal(false);

    navigate("/");
  };
  return (
    <div className="registration-container">
      {showModal && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          className="fix-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Registration Submitted</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Thank you for registering! Your request has been submitted and is
            pending admin approval.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => handleCloseModal()}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      {!isRegistered
        ? existedUser &&
          address && (
            <div className="registration-form">
              <h2>Create Your Partner Account</h2>
              <p>
                Provide details about your property to list it on our platform.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <label>Business Name</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                  />

                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || existedUser.email}
                    onChange={handleChange}
                    required
                  />

                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || existedUser.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-section">
                  <label>Province</label>
                  <select
                    id="province"
                    name="province"
                    onChange={handleChangeOptions}
                    required
                  >
                    <option value="">Tỉnh/Thành phố</option>
                    {address.map((index) => (
                      <option data-code={index.code} value={index.name}>
                        {index.name}
                      </option>
                    ))}
                  </select>

                  <label>District</label>
                  <select
                    id="district"
                    name="district"
                    onChange={handleChangeOptions}
                  >
                    <option value="">Quận/Huyện</option>
                    {district?.map((index) => (
                      <option
                        data-code={index.code}
                        value={index.name}
                        id={index.code}
                      >
                        {index.name}
                      </option>
                    ))}
                  </select>
                  <label>Ward</label>

                  <select id="ward" name="ward" onChange={handleChangeOptions}>
                    <option value="">Phường/Xã</option>
                    {ward?.map((index) => (
                      <option
                        data-code={index.code}
                        value={index.name}
                        id={index.code}
                      >
                        {index.name}
                      </option>
                    ))}
                  </select>
                  <label>Business Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-section">
                  <label>Property Type</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select property type</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Homestay">Homestay</option>
                    <option value="Hostel">Hostel</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  onClick={(e) => handleSubmit(e)}
                >
                  Register
                </button>
              </form>
            </div>
          )
        : longitude &&
          latitude && (
            <PropertyDetailsForm
              owner={formData}
              longitude={longitude}
              latitude={latitude}
            />
          )}
    </div>
  );
};

export default PartnerRegistration;
