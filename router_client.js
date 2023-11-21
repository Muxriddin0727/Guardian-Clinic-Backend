const express = require("express");
const router_client = express.Router();
const registerController = require("./controllers/client/registerController");
const memberController = require("./controllers/client/memberController");

//Register//
router_client.post("/sign-up", registerController.signup);
router_client.post("/login", registerController.login);
router_client.get("/logout", registerController.logout);






module.exports = router_client;