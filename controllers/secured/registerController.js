const assert = require("assert");
const Definer = require("../../lib/mistake");
const Member = require("../../models/Member");

let registerController = module.exports;

registerController.signup = async (req, res) => {
  try {
    console.log("Secured: sign_up");
    assert(req.file, Definer.general_err3);

    let new_member = req.body;
    new_member.mb_type = "DOCTOR";
    new_member.mb_image = req.file.path;
    console.log(`Path of uploaded file: ${req.file.path}`);

    const member = new Member();
    const result = await member.signupData(new_member);
    assert.ok(result, Definer.general_err1);

    req.session.member = result;
    res.redirect("/secured/doctor/dashboard/:date");
  } catch (err) {
    console.log(`ERROR, secured/sign_up, ${err.message}`);
    res.json({ state: "fail", message: err.message });
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
  
  
