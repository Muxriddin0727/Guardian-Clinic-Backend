const categoryModel = require("../../schema/category.model");
const memberModel = require("../../schema/member.model");
let categoryController = module.exports;

categoryController.get_categories = async (req, res) => {
  try {
    let categories = await categoryModel.find().lean().exec();

    categories = await Promise.all(categories.map(async (category) => {
      const count = await memberModel.countDocuments({ mb_profession: category.route_path.toUpperCase() });
      return { ...category, count };
    }));

    res.status(200).json({ message: "success", data: categories });
  } catch (error) {
    res
      .status(505)
      .json({ message: "Error", extraMessage: " Error in getting categories" });
  }
};
