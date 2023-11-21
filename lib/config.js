const mongoose = require("mongoose");

exports.member_type_enums = ["USER", "ADMIN", "DOCTOR"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
exports.mb_profession_enums = [
  "DENTIST",
  "CARDIOLOGIST",
  "DERMATOLOGIST",
  "NEUROLOGIST",
  "PEDIATRICIAN",
  "PSYCHIATRIST",
  "UROLOGIST",
  "GYNECOLOGIST",
  "NUTRITIONIST",
  "PULMONOLOGIST",
  "OPHTHALMOLOGIST",
  "PULMONOLOGIST",
  "OTOLARYNGOLOGIST",
  "ENDOCRINOLOGIST"
];
exports.ordinary_enums = ["Y", "N"];

exports.blog_status_enums = ["PAUSED", "PROCESS", "DELETED"];

exports.order_status_enums = ["PAUSED", "PROCESS", "FINISHED", "DELETED"];

exports.like_view_group_list = ["product", "member", "community"];

exports.board_id_enum_list = ["celebrity", "evaluation", "story"];
exports.board_article_status_enum_list = ["active", "deleted"];

/**********************************
 *    MONGODB RELATED COMMANDS    *
 *********************************/

exports.shapeIntoMongooseObjectId = (target) => {
  if (typeof target === "string") {
    return new mongoose.Types.ObjectId(target);
  } else {
    return target;
  }
};
