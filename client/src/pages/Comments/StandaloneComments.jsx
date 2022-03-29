import { Add, ArrowBackIos, Close } from "@mui/icons-material";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Fab,
  Grid,
  IconButton,
  Modal,
  Snackbar,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { Component, Fragment } from "react";
import Comment from "../../components/Comment";
import Ticket from "../../components/Ticket";
import { TextValidator } from "react-material-ui-form-validator";
import { ValidatorForm } from "react-material-ui-form-validator";
import ApiService from "../../services/api.service";
import moment from "moment";
import StatusChip from "../../components/StatusChip";
import { DropzoneArea } from 'material-ui-dropzone';
import ImageService from "../../services/image.service";
import { Redirect } from 'react-router-dom';

class StandaloneCommentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      ticket: {
        title: "",
        date: "",
        status: "",
      },
      ticketId: '',
      isSubmitProcessing: false,
      content: "",
      openModal: false,
      showSnackbar: false,
      isClosingProcessing: false,
      imgFile: null,
    };
  }

  handleContent = (event) => {
    const content = event.target.value;
    this.setState({ content: content });
  };

  handleCloseSnackBar = (event, reason) => {
    this.setState({ showSnackbar: false });
  };

  handleOpenSnackBar = (event, reason) => {
    this.setState({ showSnackbar: true });
  };

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
      const comment = await apiService.createComment(
        this.state.ticket.id,
        this.state.content,
        pictureUrl,
      );
      if (comment === null) {
        this.handleOpenSnackBar();
      }
    } catch (error) {
      console.log(error);
      this.handleOpenSnackBar();
    }
    this.setState({ isSubmitProcessing: true });
    this.handleCloseModal();
    window.location.reload(false);
  };

  handleOpenModal = () => {
    this.setState({ openModal: true });
  };

  handleCloseModal = () => {
    this.setState({ openModal: false });
  };

  closeTicket = async () => {
    const apiService = new ApiService();

    this.setState({ isClosingProcessing: true });

    const ticket = await apiService.closeTicket(
      this.state.ticketId
    );

    if (ticket === null) {
      this.handleOpenSnackBar();
    } else {
      window.location.reload(false);
    }
    this.setState({ isClosingProcessing: false });
  };

  async componentDidMount() {
    const apiService = new ApiService();
    const ticketId = this.props.location.pathname.split('/')[2];
    
   
    const ticket = await apiService.getTicketById(
        ticketId
    );

    if (ticket == null) this.handleOpenSnackBar();

    const comments = [];

    for (let index = 0; index < ticket.comments.length; index++) {
      let apiComment = ticket.comments[index];
      comments.push(
        <Comment
          key={index}
          content={apiComment.content}
          date={apiComment.createdAt}
          sender={apiComment.sender}
          pictureUrl={apiComment.pictureUrl}
        />
      );
    }
    this.setState({ comments: comments });
    this.setState({ ticket: ticket });
    this.setState({ticketId: ticketId})
  }

  render() {
    if (localStorage.getItem('name') !== 'admin') {
        return <Redirect to='/'/>
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

    const isAdmin = localStorage.getItem("name") === "admin" ? true : false;
    let date = moment(this.state.ticket.createdAt).format("MMMM Do YYYY, h:mm");

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
                onClick={() => {
                  this.props.history.goBack();
                }}
              >
                <ArrowBackIos />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {this.state.ticket.title} of {date}
              </Typography>

              <StatusChip status={this.state.ticket.status} />
              <Box sx={{ m: 2 }} />
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
            </Toolbar>
          </AppBar>
          <Box sx={{ flexGrow: 1, padding: 10 }}>
            <Box style={{ position: "relative" }}>
              <Ticket
                ticketId={this.state.ticket.ticketId}
                date={this.state.ticket.date}
                title={this.state.ticket.title}
                status={this.state.ticket.status}
                description={this.state.ticket.description}
                pictureUrl={this.state.ticket.pictureUrl}
                email={this.state.ticket.email}
                withLink={false}
              />
            </Box>
            <Box sx={{ flexGrow: 1, marginRight: 30 }}>
              {this.state.comments}
            </Box>
            {this.state.ticket.status !== "closed" ? (
              <>
                <Grid
                  style={{
                    position: "fixed",
                    bottom: 50,
                    right: 100,
                    justifyItems: "center",
                  }}
                >
                  <Grid>
                    <Fab
                      variant="extended"
                      color="primary"
                      aria-label="add"
                      onClick={this.handleOpenModal}
                    >
                      <Add sx={{ mr: 1 }} />
                      Add a comment
                    </Fab>
                  </Grid>
                  <Box sx={{ m: 2 }} />
                  {isAdmin ? (
                    <>
                      <Grid>
                        <Fab
                          variant="extended"
                          color="warning"
                          aria-label="close"
                          onClick={this.closeTicket}
                        >
                          {this.state.isClosingProcessing === true ? (
                            <CircularProgress
                              style={{
                                color: "white",
                                paddingLeft: 30,
                                paddingRight: 30,
                              }}
                            />
                          ) : (
                            <>
                              <Close sx={{ mr: 1 }} />
                              Close this ticket
                            </>
                          )}
                        </Fab>
                      </Grid>
                    </>
                  ) : (
                    <></>
                  )}
                </Grid>
              </>
            ) : (
              <></>
            )}
          </Box>
        </Box>

        <Modal
          open={this.state.openModal}
          onClose={this.handleCloseModal}
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
              Add a new comment to conversation
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <ValidatorForm
                ref="form"
                onSubmit={this.handleSubmit}
                onError={(errors) => console.log(errors)}
              >
                <TextValidator
                  fullWidth
                  label="Enter your comment"
                  onChange={this.handleContent}
                  name="description"
                  value={this.state.content}
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

export default StandaloneCommentsPage;
