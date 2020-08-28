import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser,googleLogin } from "../../Action/Action.jsx";
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
      token:""
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
    const { email, password ,token} = this.state; 
    console.log(token);
    
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
  responseGoogle = (response) => 
  {
     const Token = response.tokenId    
     this.setState({
          token:Token
     })
     let payload ={
       idToken: Token
     }
     this.props.googleLogin(payload);
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
                        validators={["required"]}
                        errorMessages={[
                          "this field is required",
                          "email is not valid",
                        ]}
                        error={errors.email}                  
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
                      <div className="submit">
                        <div>
                          <Button                            
                            variant="contained"
                            color="primary"
                            type="submit"
                          >                     
                          <span className="MuiButton-label">Sign in</span>
                          </Button>
                        </div>
                        <div className="gglbtn">
                          <GoogleLogin
                            clientId="488281856941-gvmkiu7mv98fnk0mqec4l9edon6869lk.apps.googleusercontent.com"
                            render={(renderProps) => (
                              <div className="google-btn">
                                <div className="google-icon-wrapper">
                                  <img
                                    className="google-icon"
                                    src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                                  />
                                </div>
                                <p
                                  onClick={renderProps.onClick}
                                  disabled={renderProps.disabled}
                                  className="btn-text"
                                >
                                  <b>Sign in with google</b>
                                </p>         
                              </div>
                            )}
                            buttonText="SignIn Via Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={"single_host_origin"}
                          />
                        </div>
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
  googleLogin:PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser,googleLogin })(SignIn);
