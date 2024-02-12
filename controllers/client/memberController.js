const assert = require("assert");
const Member = require("../../models/Member");
const { shapeIntoMongooseObjectId } = require("../../lib/config");
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
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      req.member = jwt.verify(token, process.env.SECRET_TOKEN);
      next();
    } else {
      res.status(401).send({ valid: false, message: 'No authorization header provided.' });
    }
  } catch (err) {
    console.log(`ERROR, client/retrieveAtuhMember, ${err.message}`);
    res.status(500).send({ valid: false, message: 'Failed to authenticate token.' });
  }
};
memberController.getChosenMember = async (req, res) => {
  try {
    console.log("GET: client/getChosenMember");
    const id = req.member;

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
    const {mb_id,  _id } = req.body; 
    console.log("POST: client/likeBlogChosen");

    const found_member = await memberModel.findById(mb_id);
    console.log("found_member: ", found_member);
    if (found_member) {
      if (found_member.mb_likes.includes(_id)) {
        found_member.mb_likes = found_member.mb_likes.filter((id) => id !== _id);
      } else {
        found_member.mb_likes = [...found_member.mb_likes, _id];
      }

      await memberModel.findByIdAndUpdate(found_member._id, {
        mb_likes: found_member.mb_likes,
      });

      // Return the updated likes in the response
      res.json({state: 'success', mb_likes: found_member.mb_likes});
    } else {
      throw new Error('Member not found');
    }

  } catch (err) {
    console.log(`ERROR, client/likeBlogChosen, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

memberController.commentOnMember = async (req, res) => {
  try {
    const { mb_id, mb_name, _id, comment_content, mb_image } = req.body;
    console.log("POST: client/commentOnMember");

    const found_member = await memberModel.findById(mb_id);
    if (!found_member.mb_comments) {
      found_member.mb_comments = [];
    }

    const newComment = {
      _id: shapeIntoMongooseObjectId(_id),
      mb_name: mb_name,
      comment_content: comment_content,
      mb_image: mb_image,
      posted_at: Date.now(),
    };
    found_member.mb_comments.push(newComment);

    const updated_member = await memberModel.findByIdAndUpdate(
      found_member._id,
      {
        mb_comments: found_member.mb_comments,
      },
      { new: true }
    );

    res.json({ state: "success", member: updated_member });
  } catch (err) {
    console.log(`ERROR, client/commentOnMember, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

memberController.getComments = async (req, res) => {
  try {
    const { mb_id } = req.params;

    const found_member = await memberModel.findById(mb_id);
    if (!found_member) {
      return res
        .status(404)
        .json({ state: "fail", message: "Member not found" });
    }
    const sorted_comments = found_member.mb_comments.sort(
      (a, b) => new Date(b.posted_at) - new Date(a.posted_at)
    );

    res.json({ state: "success", comments: sorted_comments });
  } catch (err) {
    console.log(`ERROR, client/getComments, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

memberController.getCommentsForHome = async (req, res) => {
  try {
    const random_comments = await memberModel.aggregate([
      { $unwind: "$mb_comments" },
      { $sample: { size: 3 } },
      {
        $project: {
          comments: "$mb_comments",
        },
      },
    ]);

    res.json({
      state: "success",
      comments: random_comments.map((comment) => comment.comments),
    });
  } catch (err) {
    console.log(`ERROR, client/getComments, ${err.message}`);
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
