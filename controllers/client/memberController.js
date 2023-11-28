const assert = require("assert");
const Member = require("../../models/Member");
const jwt = require("jsonwebtoken");
const Definer = require("../../lib/mistake");
const memberModel = require("../../schema/member.model");

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
    const token = req.headers["authorization"].split(" ")[1];
    req.member = token ? jwt.verify(token, process.env.SECRET_TOKEN) : null;
    return next();
  } catch (err) {
    console.log(`ERROR, client/retrieveAtuhMember, ${err.message}`);
    return res.status(403).json({ message: Definer.auth_err3 });
  }
};

memberController.getChosenMember = async (req, res) => {
  try {
    console.log("GET: client/getChosenMember");
    const id = req.params.id;

    // console.log(req.member);

    const member = new Member();
    const result = await member.getChosenMemberData(req.member, id);

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, client/getChosenMember, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

memberController.likeMemberChosen = async (req, res) => {
  try {
    const {mb_id, _id} = req.body; 
    console.log("POST: client/likeMemberChosen");

    const found_member = await memberModel.findById(mb_id);
    if (found_member.mb_likes.includes(_id)) {
      found_member.mb_likes =  found_member.mb_likes.filter((id) => id !== _id);
    } else {
      found_member.mb_likes = [...found_member.mb_likes, _id];
    }

    await memberModel.findByIdAndUpdate(found_member._id, {
      ...found_member._doc,
    });

    res.json({ state: "success",found_member });
  } catch (err) {
    console.log(`ERROR, client/likeMemberChosen, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

memberController.updateMember = async (req, res) => {
  try {
    console.log("POST: client/updateMember");
    console.log(req.body);
    console.log(req.file);
    assert.ok(req.member, Definer.auth_err3);

    const member = new Member();
    const result = await member.updateMemberData(
      req.member?._id,
      req.body,
      req.file
    );

    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, client/updateMember, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
