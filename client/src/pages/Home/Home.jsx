import React, { Component } from "react";
import Grid from "@mui/material/Grid";
import {
  Box,
  Button,
  Fab,
  Avatar,
  Modal,
  Typography,
  CircularProgress,
  Autocomplete,
  AppBar,
  Toolbar,
  Snackbar,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import Ticket from "../../components/Ticket";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { offices } from "../../shared/department";
import TextField from "../../../node_modules/@mui/material/TextField/TextField";
import UserLoginCard from "../../components/UserCard";
import { Redirect } from "react-router-dom";
import ApiService from "../../services/api.service";
import { DropzoneArea } from "material-ui-dropzone";
import ImageService from '../../services/image.service';

class HomePage extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      tickets: [],
      renderedTickets: [],
      openModal: false,
      targetEmails: offices[1].emails.join(" ").trim().split(" ").join(","),
      title: "",
      description: "",
      isSubmitProcessing: false,
      showSnackbar: false,
      imgFile: null,
      filterOption: "normal",
    };
  }

  handleCloseSnackBar = (event, reason) => {
    this.setState({ showSnackbar: false });
  };

  handleOpenSnackBar = (event, reason) => {
    this.setState({ showSnackbar: true });
  };

  handleTargetEmail = (event) => {
    const targetEmail = event.target.value;
    this.setState({ targetEmail: targetEmail });
  };

  handleTitle = (event) => {
    const title = event.target.value;
    this.setState({ title: title });
  };

  handleDescription = (event) => {
    const description = event.target.value;
    this.setState({ description: description });
  };

  handleSendTo = (event, value) => {
    let targetEmails = "";

    for (var e in value) {
      targetEmails += value[e].emails.join() + ",";
    }

    this.setState({
      targetEmails: targetEmails
        .split(",")
        .join(" ")
        .trim()
        .split(" ")
        .join(","),
    });
  };

  handleOpenModal = () => {
    this.setState({ openModal: true });
  };

  handleCloseSnackBarModal = () => {
    this.setState({ openModal: false });
  };

  async componentDidMount() {
    const apiService = new ApiService();

    const apiTickets = await apiService.getTickets();

    if (apiTickets === null) this.handleOpenSnackBar();
    else {
      this.setState({ tickets: apiTickets });
      this.generateRenderedTickets();
    };

  }

  handleSubmit = async () => {
    const apiService = new ApiService();
    const imageService = new ImageService();
    let pictureUrl = '';

    this.setState({ isSubmitProcessing: true });

    if (this.state.imgFile != null) {
      try {
        pictureUrl = await imageService.uploadFile(this.state.imgFile);
        console.log(pictureUrl);
        
      } catch (error) {
        console.log(error);
      this.handleOpenSnackBar();
      return;
      }
     
    }
    try {
      const ticket = await apiService.createTickets(
        this.state.title,
        this.state.description,
        this.state.targetEmails,
        pictureUrl,
      );
      if (ticket === null) {
        this.handleOpenSnackBar();
      } else {
        this.handleCloseSnackBarModal();
        window.location.reload(false);
      }
    } catch (error) {
      console.log(error);
      this.handleOpenSnackBar();
    }

    this.setState({ isSubmitProcessing: false });
    this.handleCloseSnackBarModal();
  };

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
    this.setState({renderedTickets: tickets});
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
    // this.setState({tickets: tickets});
    // this.generateRenderedTickets();
  }

  render() {
    if (!localStorage.getItem("name")) {
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
                HELPDESK
              </Typography>
              <Avatar
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: "white",
                  color: "blue",
                }}
              >
                {localStorage.getItem("name")[0]}
              </Avatar>
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
              <UserLoginCard />
              <Box sx={{ m: 2 }} />
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Filtered by</InputLabel>
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
            <Fab
              variant="extended"
              color="primary"
              aria-label="add"
              onClick={this.handleOpenModal}
              style={{ position: "fixed", bottom: 50, right: 100 }}
            >
              <Add sx={{ mr: 1 }} />
              Add a ticket
            </Fab>
          </Grid>
        </Box>

        <Modal
          open={this.state.openModal}
          onClose={this.handleCloseSnackBarModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create a Ticket
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <ValidatorForm
                ref="form"
                onSubmit={this.handleSubmit}
                onError={(errors) => console.log(errors)}
              >
                <TextValidator
                  label="Title"
                  fullWidth
                  onChange={this.handleTitle}
                  name="username"
                  value={this.state.title}
                  validators={["required"]}
                  errorMessages={["this field is required"]}
                />
                <Box sx={{ m: 2 }} />
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  options={offices}
                  onChange={this.handleSendTo}
                  getOptionLabel={(option) => option.title}
                  defaultValue={[offices[1]]}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField {...params} label="Send to" />
                  )}
                />
                <Box sx={{ m: 2 }} />

                <TextValidator
                  fullWidth
                  label="Description"
                  onChange={this.handleDescription}
                  name="description"
                  value={this.state.description}
                  validators={["required"]}
                  minRows={4}
                  multiline={true}
                  errorMessages={["this field is required"]}
                />

                <Box sx={{ m: 2 }} />
                <DropzoneArea
                  dropzoneText="Upload an image to give details about your problem"
                  filesLimit={1}
                  acceptedFiles={["image/*"]}
                  onChange={(files) => {this.setState({imgFile: files[0]})}}
                  showAlerts={["error"]}
                />
                <Box sx={{ m: 2 }} />
                {this.state.isSubmitProcessing === true ? (
                  <CircularProgress />
                ) : (
                  <Button size="large" variant="contained" type="submit">
                    Submit
                  </Button>
                )}
              </ValidatorForm>
            </Typography>
          </Box>
        </Modal>

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

export default HomePage;
