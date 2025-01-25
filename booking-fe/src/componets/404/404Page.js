import React from "react";
import "./404Page.css";

const Error = () => {
  return (
    <div className="error-container">
      <div className="error-image">
        <img
          className="hidden-md hidden-lg"
          src="https://i.ibb.co/c1ggfn2/Group-193.png"
          alt=""
        />
      </div>
      <div className="error-image">
        <h1 className="text-header">
          Looks like you've found the doorway to the great nothing
        </h1>
        <p className="text-paragraph">
          The content you’re looking for doesn’t exist. Either it was removed,
          or you mistyped the link.
        </p>
        <p className="text-paragraph">
          Sorry about that! Please visit our homepage to get where you need to
          go.
        </p>
        <button className="button">Go back to Homepage</button>
      </div>
    </div>
  );
};

export default Error;
