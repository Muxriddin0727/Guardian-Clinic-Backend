const Blog = require("../../models/Blog");
const Appointment = require("../../models/Appointment");
const appointmentModel = require("../../schema/appointment.model");
const memberModel = require("../../schema/member.model");
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



doctorController.getDoctorDshboard = async (req, res) => {
  try {
    console.log("secured/getDoctorDashboard ");
    const member = res.locals.member;
    const blog = new Blog();
    const data = await blog.getDoctorDashboardDataSecured(member);
    let date = req.params.date;
    console.log("Before:", date);

    if (date) {
      const parts = date.split("-");
      date = `${parts[1]}.${parts[2]}.${parts[0]}`;
    }
    console.log("after:", date);

    const appointments = await appointmentModel.find({
      date: date,
    });
    console.log("date:", date);
    console.log("appointments", appointments);

    const mappedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        // Only iterate over slots if appointment and appointment.slots are defined
        if (appointment && appointment.slots) {
          return {
            ...appointment._doc,
            slots: await Promise.all(
              appointment.slots.map(async (slotValue) => {
                if (!slotValue.ref_id) return slotValue;
                const member = await memberModel.findById(slotValue.ref_id);
                return {
                  ...slotValue,
                  patientName: member.mb_name,
                  patientContact: member.mb_email,
                  appointmentDate: `${appointment.date} - ${slotValue.start} : ${slotValue.end}`,
                };
              })
            ),
          };
        } else {
          // If appointment or appointment.slots is undefined, return null
          return null;
        }
      })
    );
    const filteredAppointments = mappedAppointments.filter(appointment => appointment !== null);

    console.log("mappeAppointments", mappedAppointments);

    res.render("doctor-card", {
      doctor_data: data,
      appointment_data: filteredAppointments[0],
    });

    // res.status(200).json(mappedAppointments);
  } catch (err) {
    console.log(`ERROR, secued/getDoctorDashboard , ${err.message}`);
    res.redirect("/secured");
    // return res.status(500).json(err);
  }
};

doctorController.getDoctorDashboardData = async (req, res) => {
  try {
    let date = req.params.date;
    if (date) {
      const parts = date.split("-");
      date = `${parseInt(parts[1])}.${parseInt(parts[2])}.${parts[0]}`;
    }
    const appointments = await appointmentModel.find({
      date: date,
    });
    console.log("QueryDate:", date);
    console.log('appointments:', appointments);  

    const mappedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        // Only iterate over slots if appointment and appointment.slots are defined
        if (appointment && appointment.slots) {
          return {
            ...appointment._doc,
            slots: await Promise.all(
              appointment.slots.map(async (slotValue) => {
                if (slotValue && !slotValue.ref_id) return slotValue; // Check if slotValue is defined
                const member = await memberModel.findById(slotValue.ref_id);
                return {
                  ...slotValue,
                  patientName: member ? member.mb_name : '', // Check if member is defined
                  patientContact: member ? member.mb_email : '', // Check if member is defined
                  appointmentDate: `${appointment.date} - ${slotValue.start} : ${slotValue.end}`,
                };
              })
            ),
          };
        } else {
          // If appointment or appointment.slots is undefined, return null
          return null;
        }
      })
    );
    
    // Filter out any null values from mappedAppointments
    const filteredAppointments = mappedAppointments.filter(appointment => appointment !== null);
    console.log('First slot of first appointment:', filteredAppointments.length > 0 ? filteredAppointments[0].slots[0] : 'No slots');

    res.json(filteredAppointments);
  } catch (err) {
    console.log(`ERROR, secued/getDoctorDashboard , ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};



doctorController.getSignupDoctor = async (req, res) => {
  try {
    console.log("GET: cont/getSignupDoctor");
    res.render("signup", {
      professions: mb_profession_enums,
      genders: mb_gender_enums,
    });
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
