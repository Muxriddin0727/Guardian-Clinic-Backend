const { shapeIntoMongooseObjectId } = require("../lib/config");
const AppointmentModel = require("../schema/appointment.model");
const SlotModel = require("../schema/slot.model");
const MemberModel = require("../schema/member.model");

class Appointment {
  constructor() {
    this.appointmentModel = AppointmentModel;
    this.slotModel = SlotModel;
    this.memberModel = MemberModel;
  }

  async getAppointmentDetailsData(member) {
    try {
      member._id = shapeIntoMongooseObjectId(member._id);
      console.log("Member ID:", member._id); // Log the member ID
  
      const appointments = await this.appointmentModel
        .find({doctor_id:  member._id})
        .populate("slots.ref_id") // Populate the ref_id field in the slots array
        .exec();
  
      console.log("appointments:", appointments); // Log the appointments
      if (appointments.length === 0) {
        throw new Error("No appointments found");
      }
  
      let dashboardData = [];
  
      appointments.forEach(appointment => {
        appointment.slots.forEach(slot => {
          if (slot.ref_id) { // Check if ref_id is populated
            console.log("Populated slot:", slot); // Log the populated slot
            let data = {
              patientName: slot.ref_id.mb_name,
              patientContact: slot.ref_id.mb_email,
              appointmentDate: appointment.date,
              startTime: slot.start,
              endTime: slot.end
            };
            dashboardData.push(data);
          }
        });
      });
  
      console.log(dashboardData);
  
      return dashboardData;
    } catch (err) {
      console.log("Error in getAppointmentDetailsData:", err); // Log the error
      throw err;
    }
  }
}

module.exports = Appointment;
