const Blog = require("../../models/Blog");
const {
  mb_profession_enums,
  shapeIntoMongooseObjectId,
} = require("../../lib/config");
const memberModel = require("../../schema/member.model");
const Doctor = require("../../models/Doctor");
const Member = require("../../models/Member");
let doctorController = module.exports;

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

doctorController.get_by_category = async ({ params, query }, res) => {
  try {
    const { route_path } = params;
    const { type } = query;

    console.log("route_path::::::", route_path);

    const profession = mb_profession_enums.includes(route_path.toUpperCase())
      ? route_path.toUpperCase()
      : "DERMATOLOGIST";

    let doctors = await memberModel
      .find({ mb_profession: profession })
      .lean()
      .exec();

    console.log("type:", type);

    if (!doctors)
      return res.status(400).json({
        message: "Category not found",
      });

    if (type === "all-doctors") {
      // Shuffle the array for "all-doctors"
      shuffleArray(doctors);
    } else if (type === "top-doctors") {
      // Sort by likes for "top-doctors"
      doctors.sort((a, b) => b.mb_likes.length - a.mb_likes.length);
    }

    return res.status(200).json({
      message: "Category found",
      data: doctors,
    });
  } catch (err) {
    console.log(`ERROR, cont/get_by_category, ${err.message}`);
    return res.status(500).json({ message: "Could not get category" });
  }
};

doctorController.get_by_category_id = async ({ params, query }, res) => {
  try {
    const { route_path, id } = params;

    console.log(
      `Attempting to find doctor with id: ${id} in category: ${route_path}`
    );

    let doctor = await memberModel.findOne({ _id: id }).lean().exec();
    console.log(`Doctor found: ${doctor ? "Yes" : "No"}`);

    if (!doctor) {
      console.log(`Doctor with id: ${id} not found`);
      return res.status(404).json({ message: "Doctor not found" });
    }

    console.log(
      `Doctor's profession from DB: ${
        doctor.mb_profession
      }, Requested category: ${route_path.toUpperCase()}`
    );
    if (route_path.toUpperCase() !== doctor.mb_profession) {
      console.log(
        `Doctor's profession does not match the category: ${route_path}`
      );
      return res
        .status(400)
        .json({ message: "Doctor's profession does not match the category" });
    }

    console.log(`Doctor with id: ${id} found in category: ${route_path}`);
    res.status(200).json({
      message: "Success",
      data: doctor,
      route_path,
    });
  } catch (err) {
    console.log(`ERROR, client/get_by_category_id, ${err.message}`);
    return res.status(500).json({ message: "Could not get doctor" });
  }
};

doctorController.getTopDoctors = async (req, res) => {
  try {
    console.log("GET: client/getTopDoctors");
    let match = { mb_status: "ACTIVE", mb_top: "Y" }; // Change "mb_type: 'TOP'" to "mb_top: 'Y'"

    // Get top doctors data
    const result = await memberModel
      .find(match)
      .sort({ mb_likes: -1 })
      .limit(8)
      .exec();

    if (!result) {
      throw new Error("No doctors found");
    }

    // Send response
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, client/getTopDoctors, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
