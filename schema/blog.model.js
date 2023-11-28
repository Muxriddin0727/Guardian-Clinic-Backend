const mongoose = require("mongoose");
const {
  blog_status_enums,
} = require("../lib/config");

const Schema = mongoose.Schema;

const blogSchema = new mongoose.Schema(
  {
    blog_title: {
      type: String,
      required: true,
    },
   
    blog_status: {
      type: String,
      required: false,
      default: "PAUSED",
      enum: {
        values: blog_status_enums,
        message: "{VALUE} is not among permitted enum values",
      },
    },

    blog_description: {
      type: String,
      required: true,
    },

    blog_content: {
      type: String,
      required: true,
    },
 
    blog_likes: {
      type: Array,
      required: false,
      default: [].length,
    },
    blog_views: {
      type: Array,
      required: false,
      default: [].length,
    },
    doctor_mb_id: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: false,
    },
  },
  { timestamps: true }
); // createdAt, updatedAt

blogSchema.index(
  { doctor_mb_id: 1, blog_title: 1 },
  { unique: true }
);

module.exports = mongoose.model("Blog", blogSchema);