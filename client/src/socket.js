import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  updateConversationAsSeen
} from "./store/conversations";

const socket = io.connect("http://localhost:3000", {
  auth: {
    token: window.localStorage["messenger-token"]
  }
});
socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
  });
  socket.on("seen", (data) => {
    store.dispatch(updateConversationAsSeen(data.userId, data.conversationId));
  });
});

export default socket;
