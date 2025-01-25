import { useState } from "react";
import RegisterBox from "../../../componets/partner/partnerRegister/RegisterBox";
import "./partnerRegister.css";
import PartnerRegistration from "../../../componets/partner/partnerRegister/PartnerRegistration";
const PartnerRegister = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [existedUser, setExistedUser] = useState();
  return (
    <div>
      <div className="navbarr">
        <div className="navContainer">
          <a href="/">
            <span className="logo">Booking.com</span>
          </a>
        </div>
      </div>
      {!isRegister ? (
        <RegisterBox
          setIsRegister={setIsRegister}
          setExistedUser={setExistedUser}
        />
      ) : (
        <PartnerRegistration existedUser={existedUser} />
      )}
    </div>
  );
};
export default PartnerRegister;
