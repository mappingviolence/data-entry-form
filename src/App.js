import React from 'react';
import { Route, Switch } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { 
  AppBar,
  Container,
  Hidden,
  Link,
  Toolbar,
  Typography
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { createMuiTheme, withStyles } from '@material-ui/core/styles';
import Cookies from 'js-cookie';

import { history } from './configureStore';

import DataEntryForm, { DataPool, EntryPage, EditPage } from './components/data-entry-form';
import displayDate from './displayDate';

import './App.css';

const theme = createMuiTheme({});
const styles = {
  title: {
    flexGrow: 1,
    fontSize: '2.5rem',
    lineHeight: '1.48',
  },
  appbarTitle: {
    '&:hover': {
      textDecoration: 'none'
    }
  },
  appbarLink: {
    paddingRight: '25px',
    textAlign: 'center',
    fontSize: '1.1rem',
    cursor: 'pointer'
  },
  container: {
    padding: '0 40px',
    marginBottom: '50px',
  }
};

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      headers: [
        {
            key: "title",
            label: "Title"
        },
        {
            key: "date",
            label: "Date",
            render: displayDate
        },
        {
            key: "description",
            label: "Description"
        }
      ],
    }

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async login() {
    const userid = document.getElementById("userid").value;
    const password = document.getElementById("password").value;
    const token = `${userid}:${password}`;
    await fetch(`${process.env.REACT_APP_API_LOGIN_LOCATION}`, {
        method: "GET",
        headers: {
            "X-Auth-Token": token
        }
    }).then(response => {
        if (response.status === 401 || response.status === 403) {
            alert("Incorrect creditials")
        } else {
            Cookies.remove('auth-token');
            Cookies.set('auth-token', token, {domain: "localhost"})
            Cookies.set('auth-token', token, {domain: "mappingviolence.org"})
            window.location = "/";
        }
    });
  }

  logout() {
    Cookies.remove('auth-token');
    window.location = '/';
  }

  render() {
    if (!this.props.user) {
      return <>
        User ID: <input id="userid" />
        Password: <input id="password" type="password" />
        <button onClick={this.login}>Submit</button>
      </>
    }
    return (
      <ConnectedRouter history={history}>
        <AppBar className={this.props.classes.appbar} position="static">
          <Toolbar>
            <Typography className={this.props.classes.title} variant="h1" noWrap>
              <Link
                color="inherit"
                component={RouterLink}
                to="/"
                className={this.props.classes.appbarTitle}
              >
                Mapping Violence
              </Link>
            </Typography>
            <Hidden smUp>
              <MenuIcon></MenuIcon>
            </Hidden>
            <Hidden xsDown>
              <Link
                color="inherit"
                component={RouterLink}
                to="/"
                className={this.props.classes.appbarLink}
              >
                Database
              </Link>
              {/* <Link
                color="inherit"
                component={RouterLink}
                to="/admin"
                className={this.props.classes.appbarLink}
              >
                Admin
              </Link> */}
              <Link
                color="inherit"
                className={this.props.classes.appbarLink}
                onClick={this.logout}
              >
                Logout
              </Link>
            </Hidden>
          </Toolbar>
        </AppBar>
        <Container className={this.props.classes.container}>
          <DataEntryForm
            dataUrl={process.env.REACT_APP_API_DATA_LOCATION}
            schemaUrl={process.env.REACT_APP_API_SCHEMA_LOCATION}
            uischemaUrl={process.env.REACT_APP_API_UI_SCHEMA_LOCATION}
            render={(defProps) => (
              <Switch>
                <Route
                  path="/"
                  exact
                  render={() => (
                    <>
                      <h1>Mapping Violence Database</h1>
                      <p>Below are all the entries ever created by the Mapping Violence team.</p>
                      <DataPool
                        {...defProps}
                        headers={this.state.headers}
                      />
                    </>
                  )}
                >
                </Route>
                <Route
                  path="/entry/:id"
                  exact
                  render={({match}) => {
                    const id = match.params.id;
                    return (
                      <EntryPage
                        {...defProps}
                        id={id}
                      />
                    );
                  }}
                />
                <Route
                  path="/entry/:id/edit"
                  render={({match}) => {
                    const id = match.params.id;
                    return (
                      <EditPage
                        {...defProps}
                        id={id}
                      />
                    );
                  }}
                />
                <Route
                  path="/logout"
                  render={() => {
                    this.logout();
                  }}
                />
                {/* <ProtectedRoute
                  path="/admin"
                  allowedRoles={[ROLES.ADMIN]}
                  render={(props) => <AdminPage />}
                /> */}
                <Route
                  path="/"
                  render={() =>
                    <div>We couldn't find this page</div>
                  }
                />
              </Switch>
            )}
          />
          </Container>       
      </ConnectedRouter>
    );
  }
}

export default withStyles(styles)(App);
