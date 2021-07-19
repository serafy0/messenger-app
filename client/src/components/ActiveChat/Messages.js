import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  const sentMessages = messages.filter(message => message.senderId === userId);

  const lastMessageSeen = sentMessages.find((message,index) => message.seen && !sentMessages[index+1]?.seen);
  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");
        const isLastMessageSeen =(lastMessageSeen&&lastMessageSeen.id===message.id)
        return message.senderId === userId ? (
          <SenderBubble key={message.id} islastMessageSeen={isLastMessageSeen} text={message.text} time={time} otherUser={otherUser} />
        ) : (
            <OtherUserBubble key={message.id}  text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
