const mongoose = require("mongoose");
const {
  member_type_enums,
  member_status_enums,
  mb_profession_enums,
  mb_gender_enums,
  ordinary_enums,
} = require("../lib/config");

const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  mb_name: String, // author of comment
  comment_content: String, // content of comment
  mb_image: String, // author image of comment
  posted_at: { type: Date, default: Date.now }, // date and time of posting comment
});



const memberSchema = new mongoose.Schema(
  {
    mb_username: {
      type: String,
      required: true,
      index: { unique: true, sparse: true },
    },

    mb_name: {
      type: String,
      required: true,
    },

    mb_last_name: {
      type: String,
      required: true,
    },

    mb_email: {
      type: String,
      required: true,
      index: { unique: true, sparse: true },
    },

    mb_phone: {
      type: String,
      required: false,
      index: { unique: true, sparse: true },
    },

    mb_password: {
      type: String,
      required: true,
      select: false,
    },

    mb_type: {
      type: String,
      required: false,
      default: "USER",
      enum: {
        values: member_type_enums,
        message: "{VALUE} is not among permitted values",
      },
    },
    mb_status: {
      type: String,
      required: false,
      default: "ACTIVE",
      enum: {
        values: member_status_enums,
        message: "{VALUE} is not among permitted values",
      },
    },
    mb_profession: {
      type: String,
      required: false,
      enum: {
        values: mb_profession_enums,
        message: "{VALUE} is not among permitted values",
      },
    },

    mb_gender: {
      type: String,
      required: false,
      enum: {
        values: mb_gender_enums,
        message: "{VALUE} is not among permitted values",
      },
    },
    mb_address: {
      type: String,
      required: false,
    },

    mb_experience: {
      type: String,
      required: false,
    },

    mb_degree: {
      type: String,
      required: false,
    },
    mb_description: {
      type: String,
      required: false,
    },
    mb_image: {
      type: String,
      required: false,
    },
    mb_point: {
      type: Number,
      required: false,
      default: 0,
    },
    mb_top: {
      type: String,
      required: false,
      default: "N",
      enum: {
        values: ordinary_enums,
        message: "{VALUE} is not among permitted values",
      },
    },
    mb_views: {
      type: Array,
      required: false,
      default: [],
    },
    mb_follow: {
      type: Array,
      required: false,
      default: [],
    },
    mb_likes: {
      type: Array,
      required: false,
      default: [],
    },

    mb_comments: [commentSchema],
    

    mb_price: {
      type: Number,
      required: false,
      default: 0,
    },
    mb_follow: {
      type: Array,
      required: false,
      default: [].length,
    },
    mb_subscriber_cnt: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

module.exports = mongoose.model("Member", memberSchema);
