import { action, observable, makeObservable } from "mobx";

export class SupportStore {
  @observable notifyUsersList = [];
  @observable rooms = [];
  @observable currentRoomChat = 0;
  @observable roomLeftChat = 0;
  @observable currentChatMessages = [];
  @observable socketConnection = null;
  @observable message = "";

  constructor(connection) {
    this.socketConnection = connection;
    makeObservable(this);
    this.initLists();
  }

  initLists() {
    for (let i = 0; i < 1000; i++) {
      this.rooms[i] = [];
      this.notifyUsersList[i] = false;
    }
  }

  @action setMessage(message) {
    this.message = message;
  }

  @action setSocketConnection(connection) {
    this.socketConnection = connection;
  }

  @action setChatMessages(messages) {
    this.currentChatMessages = messages;
  }

  @action setCurrentRoomChat(room) {
    this.currentRoomChat = room;
  }
  @action setRoomLeftChat(room) {
    this.roomLeftChat = room;
  }
  @action updateRooms(rooms) {
    this.rooms = rooms;
  }

  @action notifyRoom(room) {
    this.notifyUsersList[room]
      ? (this.notifyUsersList[room] = false)
      : (this.notifyUsersList[room] = true);
  }
}
