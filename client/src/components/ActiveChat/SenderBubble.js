import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {Avatar, Box, Typography} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  date: {
    fontSize: 11,
    color: "#BECCE2",
    fontWeight: "bold",
    marginBottom: 5
  },
  text: {
    fontSize: 14,
    color: "#91A3C0",
    letterSpacing: -0.2,
    padding: 8,
    fontWeight: "bold"
  },
  bubble: {
    background: "#F4F6FA",
    borderRadius: "10px 10px 0 10px"
  },
  small: {
    height: "33px",
    width: "33px"
  },
}));

const Seen =(props)=>{
  const classes = useStyles();
  const {seen,dataKey,otherUser}= props
  if(seen&&seen.id===dataKey){

    return <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.small}></Avatar>
  }
  else return ""

}


const SenderBubble = (props) => {
  const classes = useStyles();
  const { time, text,seen, dataKey,otherUser} = props;
  return (
    <Box className={classes.root}>
      <Typography className={classes.date}>{time}</Typography>
      <Box className={classes.bubble}>
        <Typography className={classes.text}>{text}</Typography>
      </Box>
      <Seen seen={seen} dataKey={dataKey} otherUser={otherUser}></Seen>

    </Box>
  );
};

export default SenderBubble;
