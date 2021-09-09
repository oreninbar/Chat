import { inject, observer } from "mobx-react";
import React from "react";
import "../../css/user.css";

const User = inject(`support_store`)(
  observer((props) => {
    const open = () => {
      props.openChat(props.room);
    };

    return (
      <div
        className={`user-container ${
          props.support_store.currentRoomChat === props.room
            ? "current-chat"
            : null
        }`}
        onClick={open}
      >
        <div className="name">
          <h2 className="user-name-list">
            <div>{props.room}</div>
            {props.support_store.notifyUsersList[props.room] ? (
              <img className='notify' alt='notify-icon' src="https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/000000/external-message-chat-flatart-icons-outline-flatarticons-5.png"/>
            ) : null}
          </h2>
        </div>
      </div>
    );
  })
);

export default User;
