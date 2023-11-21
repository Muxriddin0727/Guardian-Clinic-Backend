const BlogModel = require("../schema/blog.model");
const assert = require("assert");
const { shapeIntoMongooseObjectId } = require("../lib/config");
const Definer = require("../lib/mistake");

class Blog {
  constructor() {
    this.blogModel = BlogModel;
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
