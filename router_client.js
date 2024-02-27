const express = require("express");
const router_client = express.Router();
const registerController = require("./controllers/client/registerController");
const memberController = require("./controllers/client/memberController");
const blogController = require("./controllers/client/blogController");
const doctorController = require("./controllers/client/doctorController");
const categoryController = require("./controllers/client/categoryController");
const appointmentController = require("./controllers/client/appointmentController");
const uploader_members = require("./utils/upload-multer")("members");

//Register//
router_client.post("/sign-up", registerController.signup);
router_client.post("/login", registerController.login);
router_client.get("/logout", registerController.logout);


router_client.get('/check-token', memberController.retrieveAtuhMember, (req, res) => {
  if (req.member) {
    res.status(200).send({ valid: true, member: req.member });
  } else {
    res.status(401).send({ valid: false, message: 'Failed to authenticate token.' });
  }
});
//Member//
router_client.get(
  "/member-data",
  memberController.retrieveAtuhMember,
  memberController.getChosenMember
);



router_client.post(
  "/member-update",
  uploader_members.single('profile_photo'), 
  memberController.retrieveAtuhMember,
  memberController.updateMember
);

router_client.get("/top-doctors", doctorController.getTopDoctors);

router_client.get(
  "/category",
  categoryController.get_categories
);

router_client.get(
  "/category/:route_path",
  doctorController.get_by_category
);

router_client.get(
  "/category/:route_path/:id",
  doctorController.get_by_category_id
);


router_client.post(
  "/member-liken",
  memberController.retrieveAtuhMember,
  memberController.likeMemberChosen
);

router_client.post(
  "/member-comment",
  memberController.retrieveAtuhMember,
  memberController.commentOnMember
);

router_client.get(
  "/member-comment-home",
  memberController.getCommentsForHome
);

router_client.get("/member-comments/:mb_id", memberController.getComments);

//Blogs//
router_client.get("/blogs", blogController.getAllBlogs);

router_client.get(
  "/blogs/:id/with-author",
  memberController.retrieveAtuhMember,
  blogController.getChosenBlog
);

router_client.get(
  "/get-doctor-blogs/:id",
  blogController.getDoctorBlogs
);

router_client.post(
  "/blog-liken",
  memberController.retrieveAtuhMember,
  blogController.likeBlogChosen
);

router_client.post(
  "/view-blog",
  blogController.viewBlogChosen
);

router_client.post(
  "/blog-comment",
  memberController.retrieveAtuhMember,
  blogController.commentOnBlog
);

router_client.get("/blog-comments/:blog_id", blogController.getBlogComments);

router_client.get("/liked-blogs/:id", blogController.getBlogsLikedByUser);

router_client.get("/search", blogController.getSearch);
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

router_client.get(
  "/get-appointments/:id",
  appointmentController.getAppointmentsForUser
);

module.exports = router_client;
