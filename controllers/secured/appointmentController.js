const appointmentModel = require("../../schema/appointment.model");
const Appointment = require("../../models/Appointment");

let appointmentController = module.exports;

// appointmentController.getAppointmentDetails = async (req, res) => {
//     try {
//       console.log("GET: client/getAppointmentDetails");
  
//       // Assuming the doctor's ID is stored in the session
//       const loggedInDoctorId = req.session.member._id;
  
//       if (!loggedInDoctorId)
//         return res.status(401).json({ message: "Unauthorized" });
  
//       const foundDoctor = await memberModel.findById(_id);
  
//       if (!foundDoctor)
//         return res.status(404).json({ message: "Doctor not found" });
  
//       // Check if mb_type is "DOCTOR"
//       if (foundDoctor.mb_type !== "DOCTOR") {
//         return res.status(403).json({ message: "Access forbidden for non-doctors" });
//       }
  
//       const foundAppointments = await appointmentModel.find({
//         doctor_id: loggedInDoctorId,
//       }).populate({
//         path: 'slots.ref_id',
//         model: 'member', 
//         select: ' mb_name, mb_lastname, mb_email', 
//       }).populate({
//         path: 'slots',
//         select: "start end",
//       });
  
//       res.json({
//         state: "success",
//         appointments: foundAppointments.map((appointment) => ({
//           date: appointment.date,
//           slots: appointment.slots.map((slot) => ({
//             start: slot.start,
//             end: slot.end,
//             user: {
//               name: slot.ref_id.mb_name, // Assuming 'name' is a field in the Member model
//               email: slot.ref_id.mb_email,
//             },
//           })),
//         })),
//       });
//     } catch (err) {
//       console.log(`ERROR, client/getAppointmentDetails, ${err.message}`);
//       res.json({ state: "fail", message: err.message });
//     }
//   };

appointmentController.getAppointmentDetails = async (req, res) => {
    try{
        console.log("GET: client/getAppointmentDetails");
        const appointment = new Appointment();
        const appointment_data = await appointment.getAppointmentDetailsData(res.locals.member);
        console.log("appointment_data", appointment_data);
        console.log("appointment_data", appointment_data[0].slots[0].ref_id.mb_name);
        

        res.render("doctor-card", { appointment_data: appointment_data });

    } catch (err) {
        console.log(`ERROR: client/getAppointmentDetails, ${err.message}`);
        res.redirect("/secured");
    }
};