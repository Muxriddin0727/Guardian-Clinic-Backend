const Blog = require("../../models/Blog");
const Appointment = require("../../models/Appointment");
const appointmentModel = require("../../schema/appointment.model");
const memberModel = require("../../schema/member.model");

let appointmentController = module.exports;



appointmentController.getAppointmentsForUser = async (req, res) => {
  try {
    console.log("GET: client/getAppointmentsForUser");
    const { id } = req.params;

    console.log("id:", id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all appointments
    const appointments = await appointmentModel.find().populate("doctor_id");
    console.log("appointments", appointments);

    const filteredAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= today;
    });

    const mappedAppointments = await Promise.all(
      filteredAppointments.map(async (appointment) => {
        // Only iterate over slots if appointment and appointment.slots are defined
        if (appointment && appointment.slots) {
          return {
            ...appointment._doc,
            slots: await Promise.all(
              appointment.slots
                .filter(
                  (slotValue) =>
                    slotValue.ref_id && slotValue.start && slotValue.end
                ) // filter slots that have appointments
                .map(async (slotValue) => {
                  const member = await memberModel.findById(slotValue.ref_id);
                  const doctor = await memberModel.findById(
                    appointment.doctor_id
                  );
                  return {
                    ...slotValue,
                    patientName: member.mb_name,
                    patientContact: member.mb_email,
                    appointmentDate: `${appointment.date} - ${slotValue.start} : ${slotValue.end}`,
                    doctorName: doctor.mb_name,
                    doctorLastname: doctor.mb_last_name,
                    doctorImg: doctor.mb_image,
                  };
                })
            ),
          };
        } else {
          return null;
        }
      })
    );

    console.log("mappedAppointments", mappedAppointments);

    const finalAppointments = mappedAppointments.filter(
      (appointment) => appointment !== null
    );

    console.log("mappeAppointments", mappedAppointments);

    res.json({
      state: "success",
      appointment_data: finalAppointments, // return all appointments
    });
  } catch (err) {
    console.log(`ERROR, secued/getDoctorDashboard , ${err.message}`);
    res.status(500).json({ message: err.message }); // send a response with the error message
  }
};



