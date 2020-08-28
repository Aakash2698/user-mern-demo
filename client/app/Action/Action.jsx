import SetAuthToken from "../utils/SetAuthToken.jsx";
import jwt_decode from "jwt-decode";

import {
  SET_CURRENT_USER,
  USER_LOADING,
  GET_ERRORS,
} from "../ActionType/ActionType.jsx";

//Register user
export const registerUser = (userData, history) => {
  return async (dispatch) => {
    const url = "http://localhost:8080/register";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((res) => history.push("/sign-in"))
      .catch((err) =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        })
      );
  };
};

export const loginUser = (userData) => {
  return async (dispatch) => {
    const url = "http://localhost:8080/login";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    }).then((res) => {
      res.json().then((json) => {
        const token = json.token;
        localStorage.setItem("jwtToken", token);
        SetAuthToken(token);
        const decoded = jwt_decode(token);
        dispatch(setCurrentUser(decoded));
      });
    });
  };
};

export const googleLogin = (token) => {

  return async (dispatch) => {
    const url = "http://localhost:8080/google-login";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token)
    }).then((res) => {
      console.log("ACTION RESPONSE",res);
      
    });
  };
};

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("jwtToken");
  SetAuthToken(false);
  dispatch(setCurrentUser({}));
};
