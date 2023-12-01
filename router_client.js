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
  doctorController.get_by_category_id
);

// router_client.get(
//   "/category/:id",
//   memberController.retrieveAtuhMember,
//   doctorController.get_by_category_id
// );

router_client.post(
  "/member-liken",
  memberController.retrieveAtuhMember,
  memberController.likeMemberChosen
);

//Blogs//
router_client.get("/blogs", blogController.getAllBlogs);

router_client.get(
  "/blogs/:id/with-author",
  memberController.retrieveAtuhMember,
  blogController.getChosenBlog
);

router_client.post(
  "/blog-liken",
  memberController.retrieveAtuhMember,
  blogController.likeBlogChosen
);

router_client.get(
  "/blogs/:id",
  memberController.retrieveAtuhMember,
  blogController.viewBlogChosen
);

//Appointments//
router_client.get(
  "/appointments",
  memberController.retrieveAtuhMember,
  appointmentController.getAllAppointments
);

router_client.get(
  "/appointments/:ref_id",
  memberController.retrieveAtuhMember,
  appointmentController.getChosenAppointment
);

router_client.post(
  "/create-appointment/:ref_id",
  memberController.retrieveAtuhMember,
  appointmentController.createAppointment
);

router_client.post(
  "/update-appointment/:id",
  memberController.retrieveAtuhMember,
  appointmentController.updateAppointment
);

router_client.post(
  "/remove-appointment/:id",
  memberController.retrieveAtuhMember,
  appointmentController.removeAppointment
);

//Slots//
router_client.get(
  "/slots",
  memberController.retrieveAtuhMember,
  slotController.getAllSlots
);

router_client.get(
  "/slots/:id",
  memberController.retrieveAtuhMember,
  slotController.getChosenSlot
);

router_client.post(
  "/create-slot",
  memberController.retrieveAtuhMember,
  slotController.createSlot
);

router_client.post(
  "/update-slot/:id",
  memberController.retrieveAtuhMember,
  slotController.updateSlot
);

router_client.post(
  "/remove-slot/:id",
  memberController.retrieveAtuhMember,
  slotController.removeSlot
);

module.exports = router_client;
