const express = require("express");
const router_secured = express.Router();
const doctorController = require("./controllers/secured/doctorController");
const registerController = require("./controllers/secured/registerController");
const blogController = require("./controllers/secured/blogControler");
const uploader_members = require("./utils/upload-multer")("members");

router_secured.get("/", doctorController.home);
//Register//
router_secured
  .get("/sign-up", doctorController.getSignupDoctor)
  .post(
    "/sign-up",
    uploader_members.single("doctor_img"),
    registerController.signup
  );

router_secured
  .get("/login", doctorController.getLoginDoctor)
  .post("/login", registerController.login);

router_secured.get("/logout", registerController.logout);
router_secured.get("/check-me", doctorController.checkSessions);

//Others//
router_secured.get("/doctor/dashboard", doctorController.getDoctorBlogs);
router_secured.post("/blogs/create", 
doctorController.validateDoctor,
blogController.addNewBlog

);
router_secured.post("/blogs/edit/:id",
 doctorController.validateDoctor,
 blogController.updateChosenBlog
);


module.exports = router_secured;
