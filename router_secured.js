const express = require("express");
const router_secured = express.Router();
const doctorController = require("./controllers/secured/doctorController");
const registerController = require("./controllers/secured/registerController");
const appointmentController = require("./controllers/secured/appointmentController");
const blogController = require("./controllers/secured/blogControler");
const uploader_members = require("./utils/upload-multer")("members");
const memberController = require("./controllers/secured/member.Controller");

router_secured.get("/", doctorController.home);
//Register//
router_secured
  .get("/sign-up", doctorController.getSignupDoctor)
  .post("/sign-up", uploader_members.single("doctor_img"), (req, res) => {
    registerController.signup;

    res.status(200).send("Form uploaded succesfully");
  },
  (error, req, res, next) => {
    console.error(error);
    res.status(500).send(error);
  }
  );

router_secured
  .get("/login", doctorController.getLoginDoctor)
  .post("/login", registerController.login);

router_secured.get("/logout", registerController.logout);
router_secured.get("/check-me", doctorController.checkSessions);

//Others//

router_secured.get(
  "/doctor/dashboard/:date",
  doctorController.getDoctorDshboard
);

router_secured.get(
  "/doctor/dashboard/data/:date",
  (req, res, next) => {
    console.log("Request received for /doctor/dashboard/data/:date");
    next();
  },
  doctorController.getDoctorDashboardData
);

router_secured.post(
  "/blogs/create",
  doctorController.validateDoctor,
  blogController.addNewBlog
);
router_secured.post(
  "/blogs/edit/:id",
  doctorController.validateDoctor,
  blogController.updateChosenBlog
);

router_secured.get(
  "/all-doctors",
  memberController.validateAdmin,
  memberController.getAllDoctors
);

router_secured.post(
  "/all-doctors/edit",
  memberController.validateAdmin,
  memberController.updateDoctorsByAdmin
);

module.exports = router_secured;
