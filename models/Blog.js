const BlogModel = require("../schema/blog.model");
const Member = require("./Member");
const assert = require("assert");
const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_liked,
} = require("../lib/config");
const Definer = require("../lib/mistake");
const memberModel = require("../schema/member.model");

class Blog {
  constructor() {
    this.blogModel = BlogModel;
  }

  

  async getChosenBlogsData(member, id) {
    try {
      const auth_mb_id = member ? shapeIntoMongooseObjectId(member?._id) : null;
      id = shapeIntoMongooseObjectId(id);
  
      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, id, "blog");
      }
      console.log("member:", member);
    
      const result = await this.blogModel
        .aggregate([
          { $match: { _id: id, blog_status: "PROCESS" } },
          lookup_auth_member_liked(auth_mb_id),
          {
            $lookup: {
              from: "members",
              localField: "doctor_mb_id", 
              foreignField: "_id", 
              as: "author", 
            },
          },
          {
            $unwind: "$author", // Flatten the author data
          },
          { $addFields: { comments: "$blog_comments" } }, 

        ])
        .exec();
        // console.log("result:", result);
        // console.log("_id:", id);
        // console.log("auth_mb_id:", auth_mb_id);
        // console.log("member:", member);
  
      assert.ok(result, Definer.general_err1);
      if (result.length > 0) {
        return result[0];
      } else {
        throw new Error(`No blog found with id: ${id}`);
      }
    } catch (err) {
      throw err;
    }
  }

  async addNewBlogData(data, member) {
    try {
      data.doctor_mb_id = shapeIntoMongooseObjectId(member._id);

      const new_blog = new this.blogModel(data);

      const result = await new_blog.save();

      assert.ok(result, Definer.product_err1);

      return result;
    } catch (err) {
      throw err;
    }
  }


  async updateChosenBlogData(id, updated_data, mb_id) {
    try {
      id = shapeIntoMongooseObjectId(id);
      mb_id = shapeIntoMongooseObjectId(mb_id);

      const result = await this.blogModel
        .findOneAndUpdate(
          {
            _id: id,
            doctor_mb_id: mb_id,
          },
          updated_data,
          {
            runValidators: true,
            lean: true, //ozgargan qiymatni kormoqchiman
            new: true, // before
          }
        )
        .exec();

      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      throw err;
    }
  }

  async getDoctorDashboardDataSecured(member) {
    try {
      console.log("member:", member);
      member._id = shapeIntoMongooseObjectId(member._id);
      const result = await this.blogModel.find({
        doctor_mb_id: member._id,
      });

      // console.log("result:", result);
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      console.error("Error in getAllBlogsDataSecured:", err);
      throw err;
    }
  }


}

module.exports = Blog;
