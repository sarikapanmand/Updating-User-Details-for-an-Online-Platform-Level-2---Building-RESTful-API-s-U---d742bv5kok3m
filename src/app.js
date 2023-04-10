const fs = require("fs");
const express = require("express");
const app = express();

// Importing user details from userDetails.json file
const userDetails = JSON.parse(
  fs.readFileSync(`${__dirname}/data/userDetails.json`)
);

// Middlewares
app.use(express.json());

// Endpoint for registering a new user
app.post("/api/v1/details", (req, res) => {
  const newId = userDetails[userDetails.length - 1].id + 1;
  const { name, email, number } = req.body;
  const newUser = { id: newId, name, email, number };
  userDetails.push(newUser);
  fs.writeFile(
    `${__dirname}/data/userDetails.json`,
    JSON.stringify(userDetails),
    (err) => {
      res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: {
          userDetails: newUser,
        },
      });
    }
  );
});

// Endpoint for fetching all user details
app.get("/api/v1/details", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Details of all users fetched successfully",
    data: {
      userDetails,
    },
  });
});

// Endpoint for fetching user details by id
app.get("/api/v1/details/:id", (req, res) => {
  const { id } = req.params;
  const user = userDetails.find((user) => user.id === parseInt(id));
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  } else {
    res.status(200).json({
      status: "success",
      message: "User details fetched successfully",
      data: {
        user,
      },
    });
  }
});

// Endpoint for updating user details by id
app.patch("/api/v1/details/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, number } = req.body;
  const user = userDetails.find((user) => user.id === parseInt(id));
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  } else {
    user.name = name || user.name;
    user.email = email || user.email;
    user.number = number || user.number;
    fs.writeFile(
      `${__dirname}/data/userDetails.json`,
      JSON.stringify(userDetails),
      (err) => {
        if (err) {
          return res.status(500).json({
            status: "error",
            message: "Error updating user details",
          });
        } else {
          return res.status(200).json({
            status: "success",
            message: `User details updated successfully for id: ${id}`,
            data: {
              user,
            },
          });
        }
      }
    );
  }
});

module.exports = app;
