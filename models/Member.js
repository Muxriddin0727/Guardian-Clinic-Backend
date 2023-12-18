const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_liked,
  lookup_auth_member_following,
} = require("../lib/config");
const Definer = require("../lib/mistake");
const MemberModel = require("../schema/member.model");
const View = require("./View");
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

  async getChosenMemberData(member, id) {
    try {
      id = shapeIntoMongooseObjectId(id);
  
      const result = await this.memberModel
        .findOne({
          _id: id,
          mb_status: "ACTIVE",
        })
        .exec();
  
      assert.ok(result, Definer.general_err2);
  
      return result;
    } catch (err) {
      throw err;
    }
  }

  async viewChosenItemByMember(member, view_ref_id, group_type) {
    try {
      view_ref_id = shapeIntoMongooseObjectId(view_ref_id);
      const mb_id = shapeIntoMongooseObjectId(member._id);

      const view = new View(mb_id);

      const isValid = await view.validateChosenTarget(view_ref_id, group_type);
      console.log("isValid:::", isValid);
      assert.ok(isValid, Definer.general_err2);

      const doesExist = await view.checkViewExistence(view_ref_id);
      console.log("doesExist::::", doesExist);

      if (!doesExist) {
        const result = await view.insertMemberView(view_ref_id, group_type);
        assert.ok(result, Definer.general_err1);
      }

      return true;
    } catch (err) {
      throw err;
    }
  }

  async  getLikesCount(memberId) {
    const member = await memberModel.findById(member._id);
    return member ? member.mb_likes.length : 0;
  }

  async updateMemberData(id, data,image) {
    try {
      const mb_id = shapeIntoMongooseObjectId(id);
  
      let params = {
        mb_name: data.name,
        mb_last_name: data.surname,
        mb_username: data.username,
        mb_email: data.email,
        mb_phone: data.phone_number,
        mb_image: image ? image.path : null
      };
  
      for(let prop in params) if (!params[prop]) delete params[prop];
      console.log(`Updating member with id: ${mb_id} and params: ${JSON.stringify(params)}`);
      const result = await this.memberModel
      .findOneAndUpdate(
        {_id: mb_id}, 
        params, 
        {runValidators:true, lean:true, returnDocument: "after"}
        ).exec();
      console.log(`Update result: ${JSON.stringify(result)}`);
      assert.ok (result, Definer.general_err1);
      return result;
    }catch (err){
      console.log(`Error updating member: ${err}`);
      throw err;
    }
  }

  
}

module.exports = Member;
