import { action, observable, makeObservable } from "mobx";

export class CustomerStore {
  @observable message = "";
  @observable room = 0;
  @observable chatMessages = [];
  @observable socketConnection = null;
  @observable alreadyOpened = false;



  constructor() {
    makeObservable(this);
  }

  
  @action setMessage(message) {
    this.message = message;
  }
  
  @action setAlreadyOpened() {
    this.alreadyOpened = true;
  }

  @action setSocketConnection(connection) {
    this.socketConnection = connection;
  }

  @action setChatMessages(messages) {
    this.chatMessages = messages;
  }

  @action setRoom(room) {
    this.room = room;
  }


}
