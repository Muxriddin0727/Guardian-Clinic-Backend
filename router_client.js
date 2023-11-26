const express = require("express");
const router_client = express.Router();
const registerController = require("./controllers/client/registerController");
const memberController = require("./controllers/client/memberController");
const blogController = require("./controllers/client/blogController");
const doctorController = require("./controllers/client/doctorController");
const categoryController = require("./controllers/client/categoryController");
const appointmentController = require("./controllers/client/appointmentController");
const slotController = require("./controllers/client/slotController");
//Register//
router_client.post("/sign-up", registerController.signup);
router_client.post("/login", registerController.login);
router_client.get("/logout", registerController.logout);

//Member//
router_client.get(
  "/member/:id",
  memberController.retrieveAtuhMember,
  memberController.getChosenMember
);
router_client.get(
  "/top-doctors",
  memberController.retrieveAtuhMember,
  doctorController.getTopDoctors
);

router_client.get(
  "/category",
  memberController.retrieveAtuhMember,
  categoryController.get_categories
);  


router_client.get(
  "/category/:route_path",
  memberController.retrieveAtuhMember,
  doctorController.get_by_category
);

router_client.get(
  "/category/:route_path/:id",
  memberController.retrieveAtuhMember,
  doctorController.getDoctorById
);

router_client.post(
  "/member-liken",
  memberController.retrieveAtuhMember,
  memberController.likeMemberChosen
);

//Blogs//
router_client.get("/blogs", 
blogController.getAllBlogs
);

router_client.get(
  "/blogs/:id/with-author",
  memberController.retrieveAtuhMember,
  blogController.getChosenBlog
);

//Appointments//
router_client.get(
  "/appointments",
  memberController.retrieveAtuhMember,
  appointmentController.getAllAppointments
);

router_client.get(
  "/appointments/:id",
  memberController.retrieveAtuhMember,
  appointmentController.getChosenAppointment
);

router_client.post(
  "/create-appointment",
  memberController.retrieveAtuhMember,
  appointmentController.createAppointment
);



module.exports = router_client;
