const assert = require("assert");
const Definer = require("../../lib/mistake");
const Member = require("../../models/Member");
const { MongoServerError } = require('mongodb');

let registerController = module.exports;

registerController.signup = async (req, res) => {
  try {
    console.log("Secured: sign_up - Start");

    // Check if file is uploaded
    if (!req.file) {
      console.log("Error: No file uploaded");
      return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log("File uploaded successfully:", req.file.path);

    let new_member = req.body;
    new_member.mb_type = "DOCTOR";
    new_member.mb_image = req.file.path;
    console.log(`Path of uploaded file: ${req.file.path}`);

    const member = new Member();
    console.log("Attempting to signup data...");
    const result = await member.signupData(new_member);
    console.log("Signup data result:", result);

    if (!result) {
      console.log("Error: Signup data failed");
      return res.status(500).json({ message: 'Signup data failed' });
    }

    req.session.member = result;
    console.log("Session data set successfully");

    // Redirect URL should not include placeholders like :date
    // Ensure this is replaced with actual values or removed if not needed
    res.redirect("/secured/doctor/dashboard");
  } catch (err) {
    console.log(`ERROR, secured/sign_up, ${err.message}`);
    if (err instanceof MongoServerError && err.code ===  11000) {
      return res.status(400).json({ message: 'Username already exists' });
    } else {
      res.json({ state: "fail", message: err.message });
    }
  }
};

registerController.login = async (req, res) => {
    try {
      console.log("Secured: cont/login");
      const data = req.body,
        member = new Member(),
        result = await member.loginData(data);
  
      req.session.member = result;
      req.session.save(function () {
        result.mb_type === "ADMIN"
          ? res.redirect("/secured/all-doctors")
          : res.redirect("/secured/doctor/dashboard/:date");
      });
    } catch (err) {
      console.log(`ERROR, secured/login, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  };

  registerController.logout = (req, res) => {
    try {
      console.log("secured/logout");
      // console.log("req.session", req.session);
      req.session.destroy(function () {
        res.redirect("/secured");
      });
    } catch (err) {
      console.log(`ERROR, secured/logout, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  };
  
  
