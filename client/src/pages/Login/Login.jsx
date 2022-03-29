import React, { Component, Fragment } from "react";
import {
  Checkbox,
  Grid,
  Button,
  Box,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import MicrosoftLoginButton from "../../components/MicrosoftLogin";
import ApiService from "../../services/api.service";

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false,
      username: "",
      password: "",
      showSnackbar: false,
      goToHome: false,
      goToAdmin: false,
    };
  }

  handleClick = () => {
    this.setState({ showSnackbar: true });
  };

  handleClose = (event, reason) => {
    this.setState({ showSnackbar: false });
  };

  authHandler = async (err, data) => {
    const apiService = new ApiService();

    try {
      if (data === undefined || err != null) {
        this.setState({ showSnackbar: true });
      } else {
        localStorage.setItem("name", data.displayName);
        localStorage.setItem("email", data.account.userName);
        localStorage.setItem("outlookId", data.account.accountIdentifier);

        const user = await apiService.getUser();
        if (user == null) {
          try {
            const user = await apiService.createUser();

            if (user == null) {
              this.setState({ showSnackbar: true });
            } else {
              this.props.history.push("/home");
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          this.props.history.push("/home");
        }
      }
    } catch (error) {
      console.log(`Error + ${error}`);
      this.setState({ showSnackbar: true });
    }
  };

  handleUsernameChange = (event) => {
    const username = event.target.value;
    this.setState({ username });
  };

  handlePasswordChange = (event) => {
    const password = event.target.value;
    this.setState({ password });
  };

  handleAdminSubmit = () => {
    if (this.state.username === "admin" && this.state.password === "admin") {
      localStorage.setItem("name", "admin");
      localStorage.setItem("email", "admin");
      localStorage.setItem("outlookId", "admin");
      this.props.history.push("/admin");
    } else {
      this.setState({ showSnackbar: true });
    }
  };

  render() {
    const action = (
      <React.Fragment>
        <Button color="secondary" size="small" onClick={this.handleClose}>
          Close
        </Button>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={this.handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    );

    const FormBody =
      this.state.isAdmin === true ? (
        <>
          <ValidatorForm
            ref="form"
            onSubmit={this.handleAdminSubmit}
            onError={(errors) => console.log(errors)}
          >
            <TextValidator
              label="Username"
              onChange={this.handleUsernameChange}
              name="username"
              value={this.state.username}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <Box sx={{ m: 2 }} />
            <TextValidator
              label="Password"
              onChange={this.handlePasswordChange}
              name="password"
              value={this.state.password}
              validators={["required"]}
              errorMessages={["this field is required"]}
            />
            <Box sx={{ m: 2 }} />
            <Button size="large" variant="contained" type="submit">
              Submit
            </Button>
          </ValidatorForm>
        </>
      ) : (
        <>
          <Grid item xs={3}>
            <MicrosoftLoginButton authHandler={this.authHandler} />
          </Grid>
        </>
      );

    return (
      <>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item xs={3}>
            {FormBody}
          </Grid>
          <Grid item xs={3} direction="row">
            <Checkbox
              value=""
              checked={this.state.isAdmin}
              onChange={() => {
                this.setState({ isAdmin: !this.state.isAdmin });
              }}
              color="primary"
            />
            Are you an admin ?
          </Grid>
        </Grid>

        <Snackbar
          open={this.state.showSnackbar}
          autoHideDuration={6000}
          onClose={this.handleClose}
          message="Note archived"
          action={action}
        >
          <Alert severity="error">An error occured!</Alert>
        </Snackbar>
      </>
    );
  }
}

export default LoginPage;
