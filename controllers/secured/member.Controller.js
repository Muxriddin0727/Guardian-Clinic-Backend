const Doctor = require ("../../models/Doctor");
let memberController = module.exports;



memberController.validateAdmin = (req, res, next) => {
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

memberController.getAllDoctors = async (req, res) => {
    try {
      console.log("GET: secured/getAllDoctors");
      const doctor = new Doctor();
      const doctor_data = await doctor.getAllDoctorsDataSecured();
      res.render("all-doctors", { doctor_data: doctor_data });
    } catch (err) {
      console.log(`ERROR, secured/getAllDoctors, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  };

  memberController.updateDoctorsByAdmin = async (req, res) => {
    try {
      console.log("GET secured/updateDoctorsByAdmin");
      const doctor = new Doctor();
      const result = await doctor.updateDoctorsByAdminDataSecured(req.body);
      await res.json({ state: "success", data: result });
    } catch (err) {
      console.log(`ERROR, secured/updateDoctorsByAdmin, ${err.message}`);
      res.json({ state: "fail", message: err.message });
    }
  };