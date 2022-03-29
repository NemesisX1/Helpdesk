import { Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { MicrosoftLogin } from 'react-microsoft-login';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function UserCard() {
  const [msalInstance, onMsalInstanceChange] = useState();
  let history = useHistory();

  const loginHandler = (err, data, msal) => {
    if (!err && data) {
      onMsalInstanceChange(msal);
    } else {
      history.push("/");
    }
    if (!localStorage.getItem("name")) {
      history.push("/");
    }
  };

  const logoutHandler = () => {
    if (!localStorage.getItem("status") || localStorage.getItem("status") === 'login') {
      localStorage.setItem('status', 'logout')
    }
    localStorage.clear();
    history.push("/");
  };

  const logoutButton = true ? (
    <div>
      <Button variant="contained" onClick={logoutHandler}>
        Logout
      </Button>
    </div>
  ) : (
    <MicrosoftLogin
      clientId="af52fd02-77f5-42c7-a3f6-98ce30758553"
      withUserData={true}
      graphScopes={["user.read"]}
      redirectUri="http://localhost:8081/auth/callback"
      authCallback={loginHandler}
    />
  );
  return (
    <Item>
      <p>{localStorage.getItem("name")}</p>
      <a href={"mailto:" + localStorage.getItem("email")}>
        {localStorage.getItem("email")}
      </a>
      <Box sx={{ m: 2 }} />
      {logoutButton}
    </Item>
  );
}

export default UserCard;
