const AppointmentModel = require("../schema/appointment.model");
const SlotModel = require("../schema/slot.model");

class Slot {
  constructor() {
    this.appointmentModel = AppointmentModel;
    this.slotModel = SlotModel;
  }

  async getAllSlotsData() {
    try {
      const slots = await this.slotModel.find().exec();
      if (!slots) {
        throw new Error('Error when getting slot.');
      }
      return slots;
    } catch (err) {
      throw err;
    }
  }

  async getSlotData(id) {
    try {
      const slot = await this.slotModel.findOne({ _id: id }).exec();
      if (!slot) {
        throw new Error('No such slot');
      }
      return slot;
    } catch (err) {
      throw err;
    }
  }

  async createSlotData(body) {
    try {
      const slot = new this.slotModel({
        slot_time: body.slot_time,
        slot_date: body.slot_date,
        created_at: Date.now()
      });

      const result = await slot.save();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async updateSlotData(id, body) {
    try {
      const slot = await this.slotModel.findOne({ _id: id }).exec();
      if (!slot) {
        throw new Error('No such slot');
      }

      slot.slot_time = body.slot_time ? body.slot_time : slot.slot_time;
      slot.slot_date = body.slot_date ? body.slot_date : slot.slot_date;
      slot.created_at = body.created_at ? body.created_at : slot.created_at;

      const result = await slot.save();
      return result;
    } catch (err) {
      throw err;
    }
  }

  async removeSlotData(id) {
    try {
      const result = await this.slotModel.findByIdAndRemove(id).exec();
      if (!result) {
        throw new Error('No such slot');
      }
    } catch (err) {
      throw err;
    }
  }




}

module.exports = Slot;