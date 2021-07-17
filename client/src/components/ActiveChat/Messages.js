import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  let sent = messages.filter((a)=> a.senderId===userId
  )

  let seen= sent.find((a,index)=>(a.seen&&(sent[index+1]==undefined||!sent[index+1].seen)))

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} dataKey={message.id} seen={seen} text={message.text} time={time} otherUser={otherUser} />
        ) : (
            <OtherUserBubble key={message.id}  text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
