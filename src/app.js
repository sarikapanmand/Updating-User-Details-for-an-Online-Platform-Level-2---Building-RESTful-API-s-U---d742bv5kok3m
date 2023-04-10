const fs = require("fs");
const express = require("express");
const app = express();

// Importing products from userDetails.json file
const userDetails = JSON.parse(
  fs.readFileSync(`${__dirname}/data/userDetails.json`)
);

//Middlewares
app.use(express.json());

// Write PATCH endpoint for editing user details
app.patch("/api/v1/details/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = userDetails.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: "User not found!",
    });
  } else {
    const { name, mail, number } = req.body;
    if (name) user.name = name;
    if (mail) user.mail = mail;
    if (number) user.number = number;

    fs.writeFile(
      `${__dirname}/data/userDetails.json`,
      JSON.stringify(userDetails),
      (err) => {
        if (err) {
          return res.status(500).json({
            status: "failed",
            message: "Failed to update user details",
            error: err.message,
          });
        } else {
          return res.status(200).json({
            status: "success",
            message: "User details updated successfully",
            data: {
              userDetails: user,
            },
          });
        }
      }
    );
  }
});

// POST endpoint for registering new user
app.post("/api/v1/details", (req, res) => {
  const newId = userDetails[userDetails.length - 1].id + 1;
  const { name, mail, number } = req.body;
  const newUser = { id: newId, name, mail, number };
  userDetails.push(newUser);
  fs.writeFile(
    `${__dirname}/data/userDetails.json`,
    JSON.stringify(userDetails),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: "failed",
          message: "Failed to register user",
          error: err.message,
        });
      } else {
        return res.status(201).json({
          status: "success",
          message: "User registered successfully",
          data: {
            userDetails: newUser,
          },
        });
      }
    }
  );
});

// GET endpoint for sending the details of users
app.get("/api/v1/details", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Details of users fetched successfully",
    data: {
      userDetails,
    },
  });
});

// GET endpoint for sending the details of users by id
app.get("/api/v1/details/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = userDetails.find((user) => user.id === id);
  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: "User not found!",
    });
  } else {
    return res.status(200).json({
      status: "success",
      message: "Details of user fetched successfully",
      data: {
        userDetails: user,
      },
    });
  }
});

module.exports = app;
