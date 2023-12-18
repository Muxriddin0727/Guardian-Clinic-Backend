const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slot = require("./slot.model");

const default_slots = [
  {
    _id: 0,
    start: "08:00",
    end: "08:30",
  },
  {
    _id: 1,
    start: "08:30",
    end: "09:00",
  },

  {
    _id: 2,
    start: "09:00",
    end: "09:30",
  },
  {
    _id: 3,
    start: "09:30",
    end: "10:00",
  },

  {
    _id: 4,
    start: "10:00",
    end: "10:30",
  },
  {
    _id: 5,
    start: "10:30",
    end: "11:00",
  },

  {
    _id: 6,
    start: "11:00",
    end: "11:30",
  },
  {
    _id: 7,
    start: "11:30",
    end: "12:00",
  },

  {
    _id: 8,
    start: "12:00",
    end: "12:30",
  },
  {
    _id: 9,
    start: "12:30",
    end: "13:00",
  },

  {
    _id: 10,
    start: "13:00",
    end: "13:30",
  },
  {
    _id: 11,
    start: "13:30",
    end: "14:00",
  },

  {
    _id: 12,
    start: "14:00",
    end: "14:30",
  },
  {
    _id: 13,
    start: "14:30",
    end: "15:00",
  },

  {
    _id: 14,
    start: "15:00",
    end: "15:30",
  },
  {
    _id: 15,
    start: "15:30",
    end: "16:00",
  },

  {
    _id: 16,
    start: "16:00",
    end: "16:30",
  },
  {
    _id: 17,
    start: "16:30",
    end: "17:00",
  },

  {
    _id: 18,
    start: "17:00",
    end: "17:30",
  },
  {
    _id: 19,
    start: "17:30",
    end: "18:00",
  },

  {
    _id: 20,
    start: "18:00",
    end: "18:30",
  },
  {
    _id: 21,
    start: "18:30",
    end: "19:00",
  },
];

const appointmentSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },

    slots: {
      type: Array,
      required: true,
      default: default_slots,
    },

    doctor_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
