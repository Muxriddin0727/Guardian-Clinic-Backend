const Blog = require("../../models/Blog");
const Appointment = require("../../models/Appointment");

let appointmentController = module.exports;

appointmentController.getAllAppointments = async (req, res) => {
  try {
    console.log("POST: client/getAllAppointments");
    const appointment = new Appointment();
    const result = await appointment.getAllAppointmentsData(req.member, req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, client/getAllAppointments, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
}

appointmentController.getChosenAppointment = async (req, res) => {
  try {
    console.log("GET: client/getChosenAppointment ");
    const appointment = new Appointment();
    const id = req.params.id;
    const result = await appointment.getChosenAppointmentData(req.member, id);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, client/getChosenAppointment, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
}

appointmentController.createAppointment = async (req, res) => {
  try {
    console.log("POST: client/createAppointment");
    const appointment = new Appointment();
    const result = await appointment.createAppointmentData(req.body);
    res.json({ state: "success", data: result });
  } catch (err) {
    console.log(`ERROR, client/createAppointment, ${err.message}`);
    res.json({ state: "fail", message: err.message });
  }
}
