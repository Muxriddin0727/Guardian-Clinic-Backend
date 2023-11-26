const AppointmentModel = require("../schema/appointment.model");
const SlotModel = require("../schema/slot.model");

class Appointment {
    constructor() {
        this.appointmentModel =AppointmentModel;
        this.slotModel =SlotModel;
      }
    
        async getAllAppointmentsData() {
            try {
            const appointments = await this.appointmentModel.find().populate('slots').exec();
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
            const appointment = await this.appointmentModel.findOne({ _id: id }).exec();
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
                created_at: Date.now()
              });
              await slot.save();
        
              const appointment = new this.appointmentModel({
                name: body.name,
                email: body.email,
                slots: slot._id,
                created_at: body.created_at
              });
        
              const result = await appointment.save();
              return result;
            } catch (err) {
              throw err;
            }
          }

     
}

module.exports = Appointment;