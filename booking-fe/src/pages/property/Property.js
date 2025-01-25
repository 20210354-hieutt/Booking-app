import PropertyDetail from "../../componets/propertyDetail/propertyDetail";
import Header from "../../componets/header/Header";
import React, { useEffect, useState } from "react";
import "./Property.css";
import Navbar from "../../componets/navbar/Navbar";
import { getDistinctPlace } from "../../api/propertyAPI";

function Property() {
  const [allPlace, setAllPlace] = useState();
  useEffect(() => {
    const handleGetAllProperty = async () => {
      const respone = await getDistinctPlace();
      setAllPlace(respone);
    };
    handleGetAllProperty();
  }, []);
  return (
    <div className="Property">
      <Navbar />
      <Header places={allPlace} />
      <PropertyDetail />
    </div>
  );
}

export default Property;
