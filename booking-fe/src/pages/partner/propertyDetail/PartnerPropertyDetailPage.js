import { useParams } from "react-router-dom";
import PropertyDetail from "../../../componets/partner/propertyDetail/PartnerPropertyDetail";
import "./PartnerPropertyDetail.css";
import Sidebar from "./Sidebar";
import PartnerNavbar from "../../../componets/partner/partnerNavbar/partnerNavbar";
import { useState } from "react";
const PartnerPropertyDetailPage = () => {
  const params = useParams();

  const [tab, setTab] = useState("info");

  return (
    <>
      <PartnerNavbar />
      <div className="wrapper">
        <Sidebar setTab={setTab} tab={tab} />
        <PropertyDetail propertyId={params.id} tab={tab} setTab={setTab} />
      </div>
    </>
  );
};
export default PartnerPropertyDetailPage;
