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
       doctor_id: ref_id,
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
 
     // Modify the slots array to match the new structure
     const modifiedSlots = foundAppointment.slots.map((slot) => {
       if (slot.ref_id) {
         return {
           _id: slot._id,
           start: slot.start,
           end: slot.end,
           ref_id: slot.ref_id,
         };
       } else {
         return {
           _id: slot._id,
           start: slot.start,
           end: slot.end,
         };
       }
     });
 
     res.json({ state: "success", slots: modifiedSlots });
  } catch (err) {
     console.log(`ERROR, client/getChosenAppointment, ${err.message}`);
     res.json({ state: "fail", message: err.message });
  }
 };

appointmentController.createAppointment = async (req, res) => {
  try {
    console.log("POST: client/createAppointment");
    const { ref_id } = req.params; // doctor_id
    const { date } = req.query;
    const { mem_id, start, end } = req.body; // Use start and end instead of slot_time

    console.log(`ref_id: ${ref_id}, date: ${date}`);

    const foundDoctor = await memberModel.findById(ref_id);
    console.log(`foundDoctor: ${JSON.stringify(foundDoctor)}`);

    if (!foundDoctor)
      return res.status(404).json({ message: "Doctor not found" });

    const foundAppointment = await appointmentModel.findOne({
      date,
      doctor_id: ref_id,
    });

    if (!foundAppointment) {
      // If no appointment exists for the date, create a new one
      const createData = await appointmentModel.create({
        date,
        slots: [
          {
            start, // Use start time from the request body
            end, // Use end time from the request body
            doctor_id: foundDoctor._id, // Move doctor_id inside the slot
            user_id: mem_id,
          },
        ],
      });

      return res
        .status(200)
        .json({ message: "Appointment created", slots: createData.slots });
    } else {
      // If an appointment exists for the date, check if the slot is available
      const slotIndex = foundAppointment.slots.findIndex(
        (slot) => slot.start === start && slot.end === end
      );

      if (slotIndex !== -1 && foundAppointment.slots[slotIndex].user_id) {
        // If the slot exists and is already booked, return an error
        return res.status(400).json({ message: "Slot is already booked" });
      } else if (slotIndex !== -1) {
        // If the slot exists and is not booked, assign the user to the slot
        foundAppointment.slots[slotIndex].user_id = mem_id;
      } else {
        // If the slot does not exist, create it
        foundAppointment.slots.push({
          start, // Use start time from the request body
          end, // Use end time from the request body
          doctor_id: foundDoctor._id, // Move doctor_id inside the slot
          user_id: mem_id,
        });
      }

      // Save the updated appointment
      await foundAppointment.save();

      res.json({ state: "success", extraMessage: "Appointment created" });
    }
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
                     slotValue.doctor_id && slotValue.start && slotValue.end
                 ) // filter slots that have appointments
                 .map(async (slotValue) => {
                  const doctor = await memberModel.findById(
                     slotValue.doctor_id
                  );
                  return {
                     ...slotValue,
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

appointmentController.updateAppointment = async (req, res) => {
  try {
    console.log("POST: client/updateAppointment");
    const appointment = new Appointment();
    const result = await appointment.updateAppointmentData(
      req.params.id,
      req.body
    );
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, client/updateAppointment, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};

appointmentController.removeAppointment = async (req, res) => {
  try {
    console.log("POST: client/removeAppointment");
    const appointment = new Appointment();
    const result = await appointment.removeAppointmentData(req.params.id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, client/removeAppointment, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
};
