const assert = require("assert");
const Member = require("../../models/Member");
const jwt = require("jsonwebtoken");
const Definer = require("../../lib/mistake");

let memberController = module.exports;

memberController.checkMyAuthentication = (req, res) => {
  try {
    console.log("GET: client/checkMyAuthentication");
    let token = req.cookies["access_token"];

    const member = token ? jwt.verify(token, process.env.SECRET_TOKEN) : null;

    assert.ok(member, Definer.auth_err2);

    res.json({ state: "success", data: member });
  } catch (err) {
    throw err;
  }
};

memberController.retrieveAtuhMember = (req, res, next) => {
  try {
    const token = req.cookies["access_token"];
    req.member = token ? jwt.verify(token, process.env.SECRET_TOKEN) : null;
    next();
  } catch (err) {
    console.log(`ERROR, client/retrieveAtuhMember, ${err.message}`);
    next();
  }
};
