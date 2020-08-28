import React from 'react';
import { render } from 'react-dom';

import App from './components/App/App';
import './styles/styles.scss';
import jwt_decode from "jwt-decode";
import SetAuthToken from "./utils/SetAuthToken.jsx";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import store from './Store/Store.jsx';
import {Provider} from "react-redux";
import SignUp from './components/SignUp/SignUp.jsx'
import SignIn from './components/SignIn/SignIn.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import PrivateRoute from './components/PrivateRoute/PrivateRoute.jsx'
import {setCurrentUser} from  './Action/Action.jsx'

let auth_token=localStorage.getItem("jwtToken")
console.log("---",auth_token); 
if (auth_token) 
{  console.log("Move page");

    // const token = localStorage.jwtToken;
    SetAuthToken(auth_token);
    const decoded = jwt_decode(auth_token);
    store.dispatch(setCurrentUser(decoded));
    const currentTime = Date.now() / 1000; 
    if (decoded.exp < currentTime) 
    {
      store.dispatch(logoutUser()); 
      window.location.href = "./sign-in";
    }
  }
render((
    <App>
    <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/" component={SignUp} />
            <Route exact path="/sign-up" component={SignUp} />
            <Route exact path="/sign-in" component={SignIn} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
          </div>
        </Router>
      </Provider>
    </App>

), document.getElementById('app'));
