import { NextPlan } from "@mui/icons-material";
import { Link } from "react-router-dom";
import StatusChip from "./StatusChip";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  CardMedia,
} from "@mui/material";

import moment from "moment";

function Ticket(props) {
  let date = moment(props.date).format("MMMM Do YYYY, h:mm");

  return (
  
    <>
      <Card
        sx={{ minWidth: 275, marginBottom: 5 }}
        key={props.id}
        style={props.style}
      >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            From this {date}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Typography variant="h5" component="div">
                {props.title}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <StatusChip status={props.status} />
            </Grid>
          </Grid>
          <CardContent>
            <Typography variant="body2">{props.description}</Typography>
          </CardContent>
          {props.pictureUrl !== "" && props.withLink === false ? (
            <CardMedia component="img" image={props.pictureUrl} alt="" />
          ) : (
            <></>
          )}
        </CardContent>
        <CardActions>
          <Button size="small">
            {props.withLink ? (
              <>
                <Link
                  to={{
                    pathname: "/comments",
                    state: {
                      ticketId: props.ticketId,
                      date: props.date,
                      status: props.status,
                      title: props.title,
                      description: props.description,
                      pictureUrl: props.pictureUrl,
                      email: props.email,
                    },
                  }}
                >
                  Go to comments
                </Link>
                <NextPlan />
              </>
            ) : (
              <>
                {localStorage.getItem("name") === "admin" ?
                  <Typography variant="caption" display="block" gutterBottom>
                    Ticket created by <a href={"mailto:" + props.email}>{props.email}</a>
                  </Typography>
                 : (
                  <></>
                )}
              </>
            )}
          </Button>
        </CardActions>
      </Card>
    </>
  );
}

export default Ticket;
