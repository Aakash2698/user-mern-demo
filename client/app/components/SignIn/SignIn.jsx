import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../Action/Action.jsx";
import GoogleLogin from "react-google-login";

import {
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Button,
} from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import "./SignIn.scss";
import SignPng from "./SignIn.png";
import SignUp from "../SignUp/SignUp.jsx";
class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      agreement: "",
      errors: {},
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }
  handleFormSubmit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;

    this.setState({
      email: "",
      password: "",
      agreement: "",
    });

    const userData = {
      email: email,
      password: password,
    };
    console.log("****", userData);
    this.props.loginUser(userData);
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  responseGoogle = (response) => {
    console.log("hiii");
    
    console.log(response);
  };
  render() {
    let { email, password, errors } = this.state;
    return (
      <div className="div-1">
        <div className="div-2">
          <Card className="signup-card">
            <Grid container>
              <Grid item lg={5} md={5} sm={5} xs={12}>
                <div className="img">
                  <img
                    src={SignPng}
                    alt="SignIn"
                    height="200px"
                    width="300px"
                  />
                </div>
              </Grid>
              <Grid item lg={7} md={7} sm={7} xs={12}>
                <div className="form-1">
                  <form>
                    <ValidatorForm
                      ref="form"
                      onSubmit={(event) => this.handleFormSubmit(event)}
                    >
                      <TextValidator
                        className="input"
                        variant="outlined"
                        label="Email"
                        onChange={this.handleChange}
                        type="email"
                        name="email"
                        value={email}
                        errorMessages={[
                          "this field is required",
                          "email is not valid",
                        ]}
                        error={errors.email}
                        // className={classnames('', {
                        //   invalid: errors.email || errors.emailnotfound,
                        // })}
                      />
                      <TextValidator
                        className="input"
                        label="Password"
                        variant="outlined"
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                        value={password}
                        validators={["required"]}
                        errorMessages={["this field is required"]}
                        error={errors.password}
                      />
                      <FormControlLabel
                        className="checkbox"
                        name="agreement"
                        onChange={this.handleChange}
                        control={<Checkbox checked />}
                        label="I have read and agree to the terms of service."
                      />
                      <div className=".submit">
                        <div>
                          <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                          >
                            Sign in to Enter Dashboard
                          </Button>                          
                        </div>
                        <div>
                            <GoogleLogin
                              clientId="488281856941-gvmkiu7mv98fnk0mqec4l9edon6869lk.apps.googleusercontent.com"
                              buttonText="SignIn Via Google"
                              onSuccess={this.responseGoogle}
                              onFailure={this.responseGoogle}
                              cookiePolicy={"single_host_origin"}
                            />                            
                          </div>
                        <span className="or">or</span>
                        <NavLink exact to={"/sign-up"}>
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
SignIn.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(SignIn);
