const Blog = require("../../models/Blog");
const { mb_profession_enums } = require("../../lib/config");
const memberModel = require("../../schema/member.model");
const Doctor = require("../../models/Doctor");
const Member = require("../../models/Member");
const doctor_category = require("../../lib/config").doctor_category;
let doctorController = module.exports;

doctorController.get_by_category = async ({ params, query }, res) => {
  try {
    const { route_path } = params;
    const { type, sort } = query;

    console.log("route_path::::::", route_path);
    
    const profession = mb_profession_enums.includes(route_path.toUpperCase()) ? route_path.toUpperCase() : "DENTIST";

    let doctors = await memberModel.find({ mb_profession: profession }).lean().exec();    
    console.log("doctors::::::", doctors);
    console.log("profession::::::", profession);
    console.log("route_path::::::", route_path);

    const type_check = () => {
      switch (type) {
        case "all-doctors":
          return 0;
        case "top-doctors":
          return -1;
        default:
          return 0;
      }
    };

    const sort_check = () => {
      switch (sort) {
        case "default_sorting":
          return 0;
        case "the_cheapest":
          return 1;
        case "the_most_expensive":
          return -1;
        default:
          return 0;
      }
    };
    console.log("before sorting::::::", doctors);
    if (!doctors)
      return res.status(400).json({
        message: "Category not found",
      });
    
    // Convert to JavaScript array and sort
    doctors = doctors.sort((a, b) => {
      return type_check() * (a.mb_likes - b.mb_likes) || sort_check() * (a.mb_price - b.mb_price);
    });

    return res.status(200).json({
      message: "Category found",
      data: doctors
    });
    
  } catch (err) {
    console.log(`ERROR, cont/get_by_category, ${err.message}`);
    return res.status(500).json({ message: "Could not get category" });
  }
};

doctorController.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await memberModel.findById(id);

    if (!result) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (result) {
      const member_obj = new Member();
      await member_obj.viewChosenItemByMember(result, id, "member");
    }

    return res.status(200).json({ message: "Doctor found", data: result });
  } catch (err) {
    console.log(`ERROR, cont/getDoctorById, ${err.message}`);
    return res.status(500).json({ message: "Could not get doctor" });
  }
};

// doctorController.getDoctors = async (req, res) => {
//   try {
//     console.log("GET: client/getRestaurants");
//     const data = req.query;
//     // console.log("query data::::", data);
//     const doctor = new Doctor();
//     const result = await doctor.getAllDoctorsData(req.member, data);
//     res.json({ state: "success", data: result });
//   } catch (err) {
//     console.log(`ERROR, cont/getRestaurants, ${err.message}`);
//     res.json({ state: "fail", message: err.message });
//   }
// };

// doctorController.getChosenDoctor = async (req, res) => {
//   try {
//     console.log("GET: client/getChosenRestaurant");
//     const id = req.params.id;
//     // console.log("id:::::::", id);
//     const doctor = new Doctor();

//     const result = await doctor.getChosenDoctorData(req.member, id);

//     res.json({ state: "success", data: result });
//   } catch (err) {
//     console.log(`ERROR, client/getChosenRestaurant, ${err.message}`);
//     res.json({ state: "fail", message: err.message });
//   }
// };

doctorController.getTopDoctors = async (req, res) => {
  try {
    console.log("GET: client/getTopDoctors");
    let match = { mb_status: "ACTIVE", mb_type: "DOCTOR" };

    // Get top doctors data
    const result = await memberModel
      .find(match)
      .sort({ mb_likes: -1 })
      .limit(6)
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
