const mongoose = require("mongoose");
const { like_view_group_list } = require("../lib/config");
const Schema = mongoose.Schema;

const likeSchema = new mongoose.Schema(
  {
    mb_id: { type: Schema.Types.ObjectId, required: true },
    like_ref_id: { type: Schema.Types.ObjectId, required: true },
    like_group: {
      type: String,
      required: true,
      enum: {
        values: like_view_group_list,
      },
    },

   
  },
  { timestamps: { createdAt: true } }
);

module.exports = mongoose.model("Like", likeSchema);