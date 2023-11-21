const { shapeIntoMongooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistake");
const MemberModel = require("../schema/member.model");
const assert = require("assert");
const bcrypt = require("bcryptjs");

class Member {
  constructor() {
    this.memberModel = MemberModel;
  }

  async signupData(input) {
    try {
      const salt = await bcrypt.genSalt();
      input.mb_password = await bcrypt.hash(input.mb_password, salt);
      const new_member = new this.memberModel(input);

      let result;
      try {
        result = await new_member.save();
      } catch (mongo_err) {
        console.log(mongo_err);
        throw new Error(Definer.mongo_validation_err1);
      }
      result.mb_password = "";
      return result;
    } catch (err) {
      throw err;
    }
  }

  async loginData(input) {
    try {
      const member = await this.memberModel
        .findOne(
          { mb_username: input.mb_username },
          { mb_username: 1, mb_password: 1 }
        )
        .exec();

      assert.ok(member, Definer.auth_err3);

      const isMatch = await bcrypt.compare(
        input.mb_password,
        member.mb_password
      );
      assert.ok(isMatch, Definer.auth_err4);

      return await this.memberModel
        .findOne({ mb_username: input.mb_username })
        .exec();
    } catch (err) {
      throw err;
    }
  }

 
}

module.exports = Member;
