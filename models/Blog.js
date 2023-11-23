const BlogModel = require("../schema/blog.model");
const Member = require("./Member");
const assert = require("assert");
const {
  shapeIntoMongooseObjectId,
  lookup_auth_member_liked,
} = require("../lib/config");
const Definer = require("../lib/mistake");

class Blog {
  constructor() {
    this.blogModel = BlogModel;
  }

  async getAllBlogsData(member, data) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);

      let match = { blog_status: "PROCESS" };

      const sort = { blog_likes: -1 };
      const page = Number.isInteger(data.page) ? data.page : 1;
      const limit = Number.isInteger(data.limit) ? data.limit : 12;

      const result = await this.blogModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: "members", // replace with your actual members collection name
            localField: "doctor_mb_id", // replace with your actual field name
            foreignField: "_id",
            as: "member_data"
          }
        },
        { $unwind: "$member_data" },
        lookup_auth_member_liked(auth_mb_id),
      ])
      .exec();

      assert.ok(result, Definer.general_err1);

      return result;
    } catch (err) {
      throw err;
    }
  }

  async getChosenBlogsData(member, id) {
    try {
      const auth_mb_id = shapeIntoMongooseObjectId(member?._id);
      id = shapeIntoMongooseObjectId(id);

      if (member) {
        const member_obj = new Member();
        await member_obj.viewChosenItemByMember(member, id, "blog");
      }

      const result = await this.blogModel
        .aggregate([
          { $match: { _id: id, blog_status: "PROCESS" } },
          lookup_auth_member_liked(auth_mb_id),
        ])
        .exec();

      assert.ok(result, Definer.general_err1);

      return result[0];
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

  async getAllBlogsdDataSecured(member) {
    try {
      console.log("member:", member);
      member._id = shapeIntoMongooseObjectId(member._id);
      const result = await this.blogModel.find({
        doctor_mb_id: member._id,
      });

      console.log("result:", result);
      assert.ok(result, Definer.general_err1);
      return result;
    } catch (err) {
      console.error("Error in getAllBlogsDataSecured:", err);
      throw err;
    }
  }


}

module.exports = Blog;
