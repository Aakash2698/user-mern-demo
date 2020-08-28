const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

process.env.SECRET_KEY = "secret";

const validateSignUp = require("../../validation/SignUp");
const validateSignIn = require("../../validation/SignIn");
const client = new OAuth2Client(
  "488281856941-gvmkiu7mv98fnk0mqec4l9edon6869lk.apps.googleusercontent.com"
);

module.exports = (app) => {
  app.post("/register", (req, res) => {
    const { errors, isValid } = validateSignUp(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    console.log(req.body);
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        return res
          .status(400)
          .json({ res: 400, email: "Email already exists" });
      } else {
        const newUser = new User({
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          agreement: req.body.agreement,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => res.json(user))
              .catch((err) => console.log(err));
          });
        });
      }
    });
  });

  app.post("/login", (req, res) => {
    const { errors, isValid } = validateSignIn(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email }).then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ res: 400, emailnotfound: "Email not found" });
      }
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
          };
          jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
              expiresIn: 31556926,
            },
            (err, token) => {
              if (token) {
                return res.status(201).json({
                  success: true,
                  res: 200,
                  token: "Bearer " + token,
                });
              }
            }
          );
        } else {
          return res
            .status(400)
            .json({ res: 400, passwordincorrect: "Password incorrect" });
        }
      });
    });
  });

  app.post("/google-login", (req, res) => {
    const client = new OAuth2Client(
      "488281856941-gvmkiu7mv98fnk0mqec4l9edon6869lk.apps.googleusercontent.com"
    );
    const { idToken } = req.body;
    client
      .verifyIdToken({
        idToken,
        audience:
          "488281856941-gvmkiu7mv98fnk0mqec4l9edon6869lk.apps.googleusercontent.com",
      })
      .then((response) => {
        const { email_verified, name, email } = response.payload;
        console.log(response.payload);

        if (email_verified) {
          User.findOne({ email }).exec((err, user) => {
            if (err) {
              return res.status(400).json({
                error: "Something went wrong1...",
              });
            } else {
              if (user) {
                const token = jwt.sign(
                  { _id: user._id },
                  process.env.SECRET_KEY,
                  { expiresIn: "7d" }
                );
                const { _id, name, email } = user;
                res.json({
                  token,
                  user: { _id, name, email },
                });
              } else 
              {
                let password = email + process.env.SECRET_KEY;
                let newUser = new User({ name, email, password });
                newUser.save((err, data) => {
                  if (err) {
                    return res.status(400).json({
                      error: "Something went wrong2...",
                    });
                  }
                  const token = jwt.sign(
                    { _id: data._id },
                    process.env.SECRET_KEY,
                    { expiresIn: "7d" }
                  );
                  const { _id, name, email } = newUser;
                  res.json({
                    token,
                    user: { _id, name, email },
                  });
                });
              }
            }
          });
        }
      });
    console.log();
  });
};
