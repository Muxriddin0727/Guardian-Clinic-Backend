const Blog = require("../../models/Blog");
const Appointment = require("../../models/Appointment");
const appointmentModel = require("../../schema/appointment.model");
const memberModel = require("../../schema/member.model");

let appointmentController = module.exports;

appointmentController.getAllAppointments = async (req, res) => {
  try {
    console.log("POST: client/getAllAppointments");
    const appointment = new Appointment();
    const result = await appointment.getAllAppointmentsData(
      req.member,
      req.body
    );
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, client/getAllAppointments, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

appointmentController.getChosenAppointment = async (req, res) => {
  try {
    console.log("GET: client/getChosenAppointment ");
    const { ref_id } = req.params;
    const { date } = req.query;
    const foundDoctor = await memberModel.findById(ref_id);

    if (!foundDoctor)
      return res.status(404).json({ message: "Doctor not found" });

    const foundAppointment = await appointmentModel.findOne({
      date,
    });

    if (!foundAppointment) {
      const createData = await appointmentModel.create({
        date,
        doctor_id: foundDoctor._id,
      });

      return res
        .status(200)
        .json({ message: "Appointment created", slots: createData.slots });
    }

    res.json({ state: "success", slots: foundAppointment.slots });
  } catch (err) {
    console.log(`ERROR, client/getChosenAppointment, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

appointmentController.createAppointment = async (req, res) => {
  try {
    console.log("POST: client/createAppointment");
    const { ref_id } = req.params;
    const { date } = req.query;
    const { slot_id, mem_id } = req.body;

    //console.log(`ref_id: ${ref_id}, date: ${date}`);

    const foundDoctor = await memberModel.findById(ref_id);
    //console.log(`foundDoctor: ${JSON.stringify(foundDoctor)}`);

    if (!foundDoctor)
      return res.status(404).json({ message: "Doctor not found" });

    const foundAppointment = await appointmentModel
      .findOne({
        date,
      })
      .populate("slots.ref_id");
    console.log(`foundAppointment: ${JSON.stringify(foundAppointment)}`);

    if (!foundAppointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (foundAppointment.doctor_id != foundDoctor._id)
      return res.status(400).json({ message: "Refered Doctor does not match" });

    await appointmentModel.findByIdAndUpdate(foundAppointment._id, {
      ...foundAppointment._doc,
      slots: foundAppointment.slots.map((value) =>
        value._id === slot_id ? { ...value, ref_id: mem_id } : value
      ),
    }),
      res.json({
        state: "success",
        extraMessage: "Appointment created",
      });
  } catch (err) {
    console.log(`ERROR, client/createAppointment, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

appointmentController.getAppointmentsForUser = async (req, res) => {
  try {
    console.log("GET: client/getAppointmentsForUser");
    const { id } = req.params;

    console.log("id:", id);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all appointments
    const appointments = await appointmentModel.find({ 'slots.ref_id': id }).populate("doctor_id");
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

