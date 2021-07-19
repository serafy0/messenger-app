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
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
    fontWeight: "bold"
  },
  notification: {
    height: 20,
    width: 20,
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
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser,unread } = conversation;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography style={unread>0?{fontWeight:"bolder", color:"black"}:null} className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      {unread > 0 && <Typography style={unread>9?{"width":30}:null} className={classes.notification}>
        {unread}
      </Typography>
      }
    </Box>
  );
};

export default ChatContent;
