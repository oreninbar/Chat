import React, { useEffect, useRef, useState } from "react";
import { inject, observer } from "mobx-react";
import Chat from "./chat/Chat";
import "../../css/customer.css";
import ChatIcon from "../../img/chat.png";
import CloseIcon from "../../img/cancel.png";
import io from "socket.io-client";

const Customer = inject("customer_store")(
  observer((props) => {
    const [chatOpen, setChatOpen] = useState(false);
    const socketRef = useRef("http://localhost:5050");

    useEffect(() => {
      socketRef.current = io.connect("http://localhost:5050");
      props.customer_store.setSocketConnection(socketRef.current)
      return;
    }, []);

    useEffect(() => {
      socketRef.current.on("get-room-number", (room) => {
        props.customer_store.setRoom(room)
        socketRef.current.emit("join-room", room);
      });
      return;
    }, []);

    const openChat =  () => {
      chatOpen ? setChatOpen(false) : setChatOpen(true);
    };

    return (
      <div className="customer-container">
        <img
          className={`chat-icon ${chatOpen}`}
          src={ChatIcon}
          alt="chat icon"
          onClick={openChat}
        />
        <div className={`customer-chat-wrapper ${chatOpen}`}>
          <img
            src={CloseIcon}
            alt="close-icon"
            className="close-icon"
            onClick={openChat}
          />
          {chatOpen && <Chat />}
        </div>
      </div>
    );
  })
);

export default Customer;
