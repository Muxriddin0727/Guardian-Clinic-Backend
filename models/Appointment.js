const AppointmentModel = require("../schema/appointment.model");
const SlotModel = require("../schema/slot.model");

class Appointment {
  constructor() {
    this.appointmentModel = AppointmentModel;
    this.slotModel = SlotModel;
  }

  async getAllAppointmentsData() {
    try {
      const appointments = await this.appointmentModel
        .find()
        .populate("slots")
        .exec();
      if (!appointments) {
        throw new Error("No appointments found");
      }
      return appointments;
    } catch (err) {
      throw err;
    }
  }

  async getChosenAppointmentData(id) {
    try {
      const appointment = await this.appointmentModel
        .findOne({ _id: id })
        .exec();
      if (!appointment) {
        throw new Error("No appointment found");
      }
      return appointment;
    } catch (err) {
      throw err;
    }
  }

  async createAppointmentData(body) {
    try {
      const slot = new this.slotModel({
        slot_time: body.slot_time,
        slot_date: body.slot_date,
        created_at: Date.now(),
      });
      await slot.save();

      const appointment = new this.appointmentModel({
        name: body.name,
        email: body.email,
        slots: slot._id,
        created_at: body.created_at,
      });

      const result = await appointment.save();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateAppointmentData(id, body) {
    try {
      const appointment = await this.appointmentModel
        .findOne({ _id: id })
        .exec();
      if (!appointment) {
        throw new Error("No such appointment");
      }

      appointment.name = body.name ? body.name : appointment.name;
      appointment.email = body.email ? body.email : appointment.email;
      appointment.slots = body.slots ? body.slots : appointment.slots;
      appointment.created_at = body.created_at
        ? body.created_at
        : appointment.created_at;

      const result = await appointment.save();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async removeAppointmentData(id) {
    try {
      const result = await this.appointmentModel.findByIdAndRemove(id).exec();
      if (!result) {
        throw new Error('No such appointment');
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = Appointment;
