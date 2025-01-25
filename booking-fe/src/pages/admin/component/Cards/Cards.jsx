import React from "react";
import { cardsData } from "../../data/DashboardData";
import "./Cards.css";
import Card from "../Card/Card";
const Cards = () => {
  return (
    <div className="Cards">
      {cardsData.map((card, index) => {
        return (
          <div className="parentContainer">
            <Card
              title={card.title}
              color={card.color}
              barValue={card.barValue}
              value={card.value}
              png={card.png}
              series={card.series}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Cards;
