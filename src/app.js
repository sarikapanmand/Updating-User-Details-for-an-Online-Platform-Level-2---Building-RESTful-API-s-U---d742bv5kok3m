const fs = require("fs");
const express = require("express");
const app = express();

// Importing products from userDetails.json file
const userDetails = JSON.parse(
  fs.readFileSync(`${__dirname}/data/userDetails.json`)
);

//Middlewares
app.use(express.json());

// PATCH endpoint for editing user details
app.patch("/api/v1/details/:id", (req, res) => {
  const { id } = req.params;
  const { name, mail, number } = req.body;
  const index = userDetails.findIndex((user) => user.id === Number(id));
  
  if (index === -1) {
    return res.status(404).json({
      status: "failed",
      message: "User not found",
    });
  }
  
  const updatedUser = { ...userDetails[index], name, mail, number };
  userDetails[index] = updatedUser;
  
  fs.writeFile(
    `${__dirname}/data/userDetails.json`,
    JSON.stringify(userDetails),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: "failed",
          message: "Error updating user details",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "User details updated successfully",
        data: {
          userDetails: updatedUser,
        },
      });
    }
  );
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
          message: "Error registering user",
        });
      }
      return res.status(201).json({
        status: "success",
        message: "User registered successfully",
        data: {
          userDetails: newUser,
        },
      });
    }
  );
});

// GET endpoint for sending the details of users
app.get("/api/v1/details", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Details of all users fetched successfully",
    data: {
      userDetails,
    },
  });
});

// GET endpoint for sending the details of users by id
app.get("/api/v1/details/:id", (req, res) => {
  const { id } = req.params;
  const user = userDetails.find((user) => user.id === Number(id));
  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: "User not found",
    });
  }
  return res.status(200).json({
    status: "success",
    message: "Details of user fetched successfully",
    data: {
      userDetails: user,
    },
  });
});

module.exports = app;
