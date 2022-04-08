import { styled } from "@mui/material/styles";
import { Box, CardMedia, Container, Divider, Paper } from "@mui/material";
import { Typography } from "@mui/material";
import moment from "moment";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: "left",
  color: theme.palette.text.secondary,
  lineHeight: "60px",
}));

function Comment(props) {
  let date = moment(props.date).format("MMMM Do YYYY, h:mm")
  return (
    <Container>
      <Item elevation={0} style={{marginBottom: 50, paddingBottom: 20}}>
        <Typography variant="h6" gutterBottom component="div">
         {props.content}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          From <a href={'mailto:' + props.sender}>{props.sender}</a> - {date}
        </Typography>
        <Divider />
        <CardMedia component="img" style={{maxHeight: '100px'}} image={props.pictureUrl} alt="" />
      </Item>
    </Container>
  );
}

export default Comment;
