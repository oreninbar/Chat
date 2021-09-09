import React, { useRef, useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import User from "./User";
import io from "socket.io-client";
import Message from "../customer/chat/Message";
import "../../css/support.css";

const Support = inject("support_store")(
  observer((props) => {
    const socketRef = useRef("http://localhost:5050");
    const [room, setRoom] = useState("");
    const [roomTitle, setRoomTitle] = useState("");
    const userName = "Artbot";

    useEffect(() => {
      socketRef.current = io.connect("http://localhost:5050");
      props.support_store.setSocketConnection(socketRef.current);
      return;
    }, [props.support_store]);

    useEffect(() => {
      props.support_store.socketConnection.on("get-rooms", (rooms) => {
        props.support_store.updateRooms(rooms);
      });
      return;
    }, [props.support_store.rooms,props.support_store]);

    useEffect(() => {
      props.support_store.socketConnection.on(
        "get-room-messages",
        (chatMessages) => {
          props.support_store.setChatMessages(chatMessages);
        }
      );
      props.support_store.socketConnection.on("left-room", (roomNumber) => {
        if (roomNumber === props.support_store.currentRoomChat) {
          props.support_store.setCurrentRoomChat(0);
          props.support_store.setChatMessages([
            {
              userName: `system`,
              message: `room ${roomNumber} had disconnected`,
              room: roomNumber,
            },
          ]);
        }
      });
      return;
    }, [props.support_store.currentRoomChat,props.support_store]);

    useEffect(() => {
      props.support_store.socketConnection.on("get-room-number", (room) => {
        setRoomTitle(room);
        props.support_store.socketConnection.emit("join-room", room);
      });

      props.support_store.socketConnection.on("get-message", (message) => {
        props.support_store.setChatMessages([
          ...props.support_store.currentChatMessages,
          message,
        ]);
      });

      props.support_store.socketConnection.on("notify-message", (payload) => {
        if (
          !props.support_store.notifyUsersList[payload.room] &&
          props.support_store.currentRoomChat !== payload.room
        )
          props.support_store.notifyRoom(payload.room);
      });
      return;
    }, [props.support_store]);

    function sendMessage(e) {
      e.preventDefault();
      if (props.support_store.currentRoomChat)
        props.support_store.socketConnection.emit("send-message", {
          userName,
          message: props.support_store.message,
          room,
        });
      props.support_store.setMessage("");
    }

    function handleInput(e) {
      props.support_store.setMessage(e.target.value);
    }

    const openChat = (room) => {
      if (props.support_store.notifyUsersList[room])
        props.support_store.notifyRoom(room);
      props.support_store.setRoomLeftChat(props.support_store.currentRoomChat);
      props.support_store.socketConnection.emit(
        "leave-room",
        props.support_store.currentRoomChat
      );
      props.support_store.setCurrentRoomChat(room);
      setRoom(props.support_store.currentRoomChat);
      props.support_store.socketConnection.emit("join-room", room);
    };

    const renderChat = () => {
      return (
        <div className="chat-container">
          <div className="chat-header">
            <div className="user-name">
              <h1 className="name" style={{ fontSize: "30px", margin: "10px" }}>
                {` ${props.support_store.currentRoomChat}`}
              </h1>
            </div>
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="chat-messages">
            {props.support_store.currentChatMessages.map(
              (m, key) =>
                m && (
                  <Message
                    key={key}
                    userName={m.userName}
                    message={m.message}
                    sender={"support"}
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
              value={props.support_store.message}
              onChange={handleInput}
            />
            <div type="submit" className="input-btn" onClick={sendMessage}>
              send
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="support-container">
        <div className="rooms-wrapper">
          <div className="rooms-container">
            {props.support_store.rooms.map((c, key) =>
              c.socketId && key !== roomTitle ? (
                <User
                  key={key}
                  room={key}
                  id={c.socketId}
                  openChat={openChat}
                />
              ) : null
            )}
          </div>
        </div>
        <div className="support-chat-wrapper">{renderChat()}</div>
      </div>
    );
  })
);

export default Support;
