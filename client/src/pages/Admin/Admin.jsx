import React, { Component } from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Avatar,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Snackbar,
  Alert,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import UserLoginCard from "../../components/UserCard";
import Ticket from "../../components/Ticket";
import { Redirect } from "react-router-dom";
import { Close, PowerSettingsNew } from "@mui/icons-material";
import ApiService from "../../services/api.service";

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      openModal: false,
      renderedTickets: [],
      targetEmail: "",
      isSubmitProcessing: false,
      filterOption: "normal",
    };
  }

  handleTargetEmail = (event) => {
    const targetEmail = event.target.value;
    this.setState({ targetEmail: targetEmail });
  };

  handleOpenModal = () => {
    this.setState({ openModal: true });
  };

  handleCloseModal = () => {
    this.setState({ openModal: false });
  };

  handleCloseSnackBar = (event, reason) => {
    this.setState({ showSnackbar: false });
  };

  handleOpenSnackBar = (event, reason) => {
    this.setState({ showSnackbar: true });
  };

  async componentDidMount() {
    const apiService = new ApiService();

    const apiTickets = await apiService.getTickets();

    if (apiTickets === null) this.handleOpenSnackBar();
    else {
      this.setState({ tickets: apiTickets });
      this.generateRenderedTickets();
    }
  }

  generateRenderedTickets() {
    const tickets = [];
    this.state.tickets.forEach((ticket) => {
      tickets.push(
        <Ticket
          key={this.state.tickets.indexOf(ticket)}
          ticketId={ticket.id}
          date={ticket.createdAt}
          title={ticket.title}
          status={ticket.status}
          description={ticket.description}
          pictureUrl={ticket.pictureUrl}
          withLink={true}
          email={ticket.email}
        />
      );
    });
    this.setState({ renderedTickets:  tickets.reverse() });
  }

  componentDidUpdate() {
    // const tickets = this.state.tickets;
    // if (this.state.filterOption === 'byStatus') {
    //   tickets.sort((a, b) => {
    //     if (a.status === 'closed') {
    //       return -1;
    //     }
    //     if (a.status === 'pending') {
    //       return 1
    //     }
    //     return 0;
    //   })
    // }
   //console.log(tickets);
  }

  render() {
    if (!localStorage.getItem("name")) {
      return <Redirect to="/" />;
    }
    if (localStorage.getItem("name") !== "admin") {
      return <Redirect to="/" />;
    }

    const action = (
      <React.Fragment>
        <Button
          color="secondary"
          size="small"
          onClick={this.handleCloseSnackBar}
        >
          Close
        </Button>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={this.handleCloseSnackBar}
        >
          <Close fontSize="small" />
        </IconButton>
      </React.Fragment>
    );

    return (
      <>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="fixed">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              ></IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                HELPDESK - Admin
              </Typography>

              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: "white",
                  color: "blue",
                }}
              >
                {localStorage.getItem("name")[0].toUpperCase()}
              </Avatar>
              <Box sx={{ m: 2 }} />
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="logout"
                onClick={() => {
                  localStorage.clear();
                  this.props.history.push("/");
                }}
              >
                <PowerSettingsNew color="white" />
              </IconButton>
            </Toolbar>
          </AppBar>
        </Box>
        <Box sx={{ flexGrow: 1, padding: 10 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              {this.state.renderedTickets}
            </Grid>
            <Grid
              item
              xs={4}
              style={{ position: "fixed", right: 100, justifyItems: "center" }}
            >
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Filtered by
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.filterOption}
                    label="filter"
                    onChange={(event) => {
                      this.setState({ filterOption: event.target.value });
                    }}
                  >
                    <MenuItem value="byStatus">By Status</MenuItem>
                    <MenuItem value="byDate">By Date</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Snackbar
          open={this.state.showSnackbar}
          autoHideDuration={6000}
          onClose={this.handleCloseSnackBar}
          message="Note archived"
          action={action}
        >
          <Alert severity="error">An error occured!</Alert>
        </Snackbar>
      </>
    );
  }
}

export default AdminPage;
