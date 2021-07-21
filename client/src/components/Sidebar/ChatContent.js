import React from "react";
import { Box, Typography,Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: props=> ({
    fontSize: 12,
    color: props.previewTextColor ,
    letterSpacing: -0.17,
    fontWeight: "bold"
  }),
  notification: props=> ({
    height: 20,
    width: props.notificationWidth,
    marginTop:20,
    marginBottom:20,
    backgroundColor: "#3F92FF",
    marginRight: 30,
    color: "white",
    fontSize: 10,
    letterSpacing: -0.5,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  }),
}));

const ChatContent = (props) => {

  const {conversation} = props;
  const {latestMessageText, otherUser, unreadCount} = conversation;
  const notificationWidth = unreadCount > 9 ? 30 : 20
  const previewTextColor = unreadCount > 0 ? "black" : "#9CADC8"
  const classes = useStyles({notificationWidth, previewTextColor});


  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      {unreadCount > 0 && <Typography className={classes.notification}>
        {unreadCount}
      </Typography>
      }
    </Box>
  );
};

export default ChatContent;
