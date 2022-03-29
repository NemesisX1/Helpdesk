import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AdminPage from "./pages/Admin/Admin";
import HomePage from "./pages/Home/Home";
import LoginPage from "./pages/Login/Login";
import CommentsPage from "./pages/Comments/Comments";
import StandaloneCommentsPage from './pages/Comments/StandaloneComments';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={(props) => <LoginPage {...props} />} />
        <Route
          exact
          path="/home"
          component={(props) => <HomePage {...props} />}
        />
        <Route
          exact
          path="/admin"
          component={(props) => <AdminPage {...props} />}
        />
        <Route
          exact
          path="/comments"
          component={(props) => <CommentsPage {...props} />}
        />
        <Route
          exact
          path="/comments/:id"
          component={(props) => <StandaloneCommentsPage {...props} />}
        />
      </Switch>
    </Router>
  );
}
