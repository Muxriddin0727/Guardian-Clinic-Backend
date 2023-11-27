const Blog = require("../../models/Blog");
const { mb_profession_enums, mb_gender_enums } = require("../../lib/config");

let doctorController = module.exports;

doctorController.home = async (req, res) => {
  try {
    console.log("Secured: home");
    res.render("home-page");
  } catch (err) {
    console.log(`ERROR, secured/home, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

doctorController.getDoctorBlogs = async (req, res) => {
  try {
    console.log("secured/getDoctorDashboard ");

    const blog = new Blog();
    const data = await blog.getAllBlogsdDataSecured(res.locals.member);

    res.render("doctor-card", { doctor_data: data });
  } catch (err) {
    console.log(`ERROR, secued/getDoctorDashboard , ${err.message}`);
    res.redirect("/secured");
  }
};

doctorController.getSignupDoctor = async (req, res) => {
  try {
    console.log("GET: cont/getSignupDoctor");
    res.render("signup", { professions: mb_profession_enums, genders: mb_gender_enums });
  } catch (err) {
    console.log(`ERROR, secured/getSignupDoctor, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

doctorController.getLoginDoctor = async (req, res) => {
  try {
    console.log("GET: secured/getLoginDoctor");
    res.render("login-page");
  } catch (err) {
    console.log(`ERROR, secured/getLoginDoctor, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

doctorController.validateDoctor = (req, res, next) => {
  if (req.session?.member?.mb_type === "DOCTOR") {
    req.member = req.session.member;
    next();
  } else {
    res.json({
      state: "fail",
      message: "only authenticated members with DOCTOR type can access!",
    });
  }
};

doctorController.checkSessions = (req, res) => {
  if (req.session?.member) {
    res.json({ state: "success", data: req.session.member });
  } else {
    res.json({ state: "fail", message: "You are not authenticated" });
  }
};

doctorController.validateAdmin = (req, res, next) => {
  if (req.session?.member?.mb_type === "ADMIN") {
    req.member = req.session.member;
    next();
  } else {
    const html = `<script> 
                      alert('Admin page: Permission denied!');
                      window.location.replace('/secured');
                    </script>`;
    res.end(html);
  }
};
