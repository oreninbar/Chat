import React, { useEffect } from "react";
import "../../../css/chat.css";
import { inject, observer } from "mobx-react";
import Message from "./Message";

const Chat = inject("customer_store")(
  observer((props) => {
    const userName = "User " + props.customer_store.room;

    useEffect(() => {
      props.customer_store.socketConnection.on("get-room-number", (room) => {
        props.customer_store.socketConnection.emit("join-room", room);
      });
      return;
    }, [props.customer_store.socketConnection]);

    useEffect(() => {
      props.customer_store.socketConnection.on("get-message", (message) => {
        props.customer_store.setChatMessages([
          ...props.customer_store.chatMessages,
          message,
        ]);
      });
      return;
    }, [props.customer_store]);

    useEffect(() => {
      if (!props.customer_store.alreadyOpened) {
        const timer = setTimeout(() => {
          props.customer_store.setChatMessages([
            ...props.customer_store.chatMessages,
            { userName: "Artbot", message: "Hi, how can I help you?" },
          ]);
        }, 400);
        props.customer_store.setAlreadyOpened()
        return () => clearTimeout(timer);
      } else return;
    }, [props.customer_store]);

    const sendMessage = (e) => {
      e.preventDefault();
      props.customer_store.socketConnection.emit("send-message", {
        userName,
        message: props.customer_store.message,
        room: props.customer_store.room,
      });
      props.customer_store.setMessage("");
    };

    const handleInput = (e) => {
      props.customer_store.setMessage(e.target.value);
    };

    return (
      <div className="chat-container">
        <div className="chat-header">
          <div className="user-name">
            <h1 className="name" style={{ fontSize: "30px", margin: "10px" }}>
              artchat
            </h1>
          </div>
          <i className="fas fa-times-circle"></i>
        </div>
        <div className="chat-messages">
          {props.customer_store.chatMessages.map(
            (m, key) =>
              m && (
                <Message
                  key={key}
                  userName={m.userName}
                  message={m.message}
                  sender={"customer"}
                  time={m.time}
                />
              )
          )}
        </div>
        <div className="chat-input">
          <input
            type="text"
            className="input"
            placeholder="enter a number"
            name="name"
            value={props.customer_store.message}
            onChange={handleInput}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                sendMessage(event);
              }
            }}
          />
          <div type="submit" className="input-btn" onClick={sendMessage}>
            send
          </div>
        </div>
      </div>
    );
  })
);

export default Chat;
