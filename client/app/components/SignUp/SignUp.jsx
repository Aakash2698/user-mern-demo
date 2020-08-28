import React, { Component } from "react";
import { withRouter, NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../Action/Action.jsx";

import {
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Button,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import SignPng from "./SignUp.png";
import "./SignUp.scss";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      agreement: true,
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };     
  handleFormSubmit = (event) => {
    event.preventDefault();   
    
    const { username, email, password, agreement } = this.state;
    this.setState({
      username: "",
      email: "",
      password: "",
      agreement: "",
    });
    const newUser = {
      username,
      email,
      password,
      agreement,
    };    
    this.props.registerUser(newUser, this.props.history);
  };
  render() {
    let { username, email, password } = this.state;
    return (
      <div className="div-1">
        <div className="div-2">
          <Card className="signup-card">
            <Grid container>
              <Grid item lg={5} md={5} sm={5} xs={12}>
                <div className="img">
                  <img
                    src={SignPng}
                    alt="SignUp"
                    height="200px"
                    width="300px"
                  />
                </div>
              </Grid>
              <Grid item lg={7} md={7} sm={7} xs={12}>
                <div className="form-1">
                  <form action="">
                    <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
                      <TextValidator
                        className="input"
                        variant="outlined"
                        label="Username"
                        onChange={this.handleChange}
                        type="text"
                        name="username"
                        value={username}
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                      />
                      <TextValidator
                        className="input"
                        variant="outlined"
                        label="Email"
                        onChange={this.handleChange}
                        type="email"
                        name="email"
                        value={email}
                        validators={["required"]}
                        errorMessages={[
                          "this field is required",
                          "email is not valid",
                        ]}
                      />
                      <TextValidator
                        className="pwd"
                        label="Password"
                        variant="outlined"
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                        value={password}
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                      />
                      <FormControlLabel
                        className="pwd"
                        name="agreement"                        
                        defaultChecked={this.state.agreement}
                        control={<Checkbox />}
                        label="I have read and agree to the terms of service."
                      />
                      <div className="submit">
                        <Button
                          className="capitalize"
                          variant="contained"
                          color="primary"
                          type="submit"
                        >
                          Sign up
                        </Button>
                        <span className="or">or</span>
                        <NavLink exact to={"/sign-in"}>
                          <Button className="capitalize">Sign in</Button>
                        </NavLink>
                      </div>
                    </ValidatorForm>
                  </form>
                </div>
              </Grid>
            </Grid>
          </Card>
        </div>
      </div>
    );
  }
}
SignUp.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(withRouter(SignUp));
