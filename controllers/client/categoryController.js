const categoryModel = require("../../schema/category.model");
let categoryController = module.exports;

categoryController.get_categories = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).json({ message: "success", data: categories });
  } catch (error) {
    res
      .status(505)
      .json({ message: "Error", extraMessage: " Error in getting caregories" });
  }
};

