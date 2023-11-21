const Member = require("../../models/Member");
const jwt = require("jsonwebtoken");
const Definer = require("../../lib/mistake");
const assert = require("assert");

let registerController = module.exports;

registerController.signup = async (req, res) => {
  try {
    console.log("POST: client/signup");
    const data = req.body,
      member = new Member(),
      new_member = await member.signupData(data);

    const token = registerController.createToken(new_member);

    res.cookie("access_token", token, {
      maxAge: 6 * 3600 * 1000,
      httpOnly: false,
    });

    res.json({ state: "success", data: new_member });
  } catch (err) {
    console.log(`ERROR, client/signup,  ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

registerController.login = async (req, res) => {
  try {
    console.log("POST: client/login");
    const data = req.body,
      member = new Member(),
      result = await member.loginData(data);

    const token = registerController.createToken(result);

    res.cookie("access_token", token, {
      maxAge: 6 * 3600 * 1000,
      httpOnly: false,
    });

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, client/login,  ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

registerController.logout = (req, res) => {
  console.log("GET: client/logout");

  res.cookie("access_token", null, { maxAge: 0, httpOnly: true });

  res.json({ sate: "success", data: "logout successfully!" });
};

registerController.createToken = (result) => {
  try {
    const upload_data = {
      _id: result._id,
      mb_username: result.mb_username,
      mb_type: result.mb_type,
    };

    const token = jwt.sign(upload_data, process.env.SECRET_TOKEN, {
      expiresIn: "6h",
    });

    assert.ok(token, Definer.auth_err2);
    return token;
  } catch (err) {
    throw err;
  }
};


  
  
