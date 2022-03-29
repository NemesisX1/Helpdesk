import MicrosoftLogin from "react-microsoft-login";

function MicrosoftLoginButton({authHandler}) {
  return (
    <>
      <MicrosoftLogin
        clientId="af52fd02-77f5-42c7-a3f6-98ce30758553"
        withUserData={true}
        graphScopes={["user.read"]}
        redirectUri="http://localhost:8081/auth/callback"
        authCallback={authHandler}
      />
    </>
  );
}

export default MicrosoftLoginButton;
