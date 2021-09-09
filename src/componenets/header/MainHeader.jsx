import React from "react";
import "../../css/mainHeader.css";
import Artphoto from "../../img/artbrain.png";

export default function MainHeader() {
  return (
    <div className="main-container">
      {/* <h1 className="name">customer</h1> */}
      <div className="logo">
        <img className="art-photo" src={Artphoto} alt="artbrain" />
      </div>
      {/* <div className="user-in-chat">
        <h1 className="name">oren</h1>
      </div> */}
    </div>
  );
}
