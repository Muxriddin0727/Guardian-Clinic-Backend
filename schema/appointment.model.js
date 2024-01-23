const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slot = require("./slot.model");

const slotSchema = new Schema({
  _id: Number,
  ref_id: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Member'
  },
  start: String,
  end: String,
 });

const default_slots = [
  {
    _id: 1,
    ref_id: null,
    start: "08:00",
    end: "08:30",
  },

  {_id: 2,
    ref_id: null,
    start: "08:30",
    end: "09:00",
  },

  {_id: 3,
    ref_id: null,
    start: "09:00",
    end: "09:30",
  },

  {_id: 4,  
    ref_id: null,
    start: "09:30",
    end: "10:00",
  },

  {_id: 5,
    ref_id: null,
    start: "10:00",
    end: "10:30",
  },

  {_id: 6,
    ref_id: null,
    start: "10:30",
    end: "11:00",
  },

  {_id: 7,
    ref_id: null,
    start: "11:00",
    end: "11:30",
  },

  {_id: 8,
    ref_id: null,
    start: "11:30",
    end: "12:00",
  },  

  {_id: 9,
    ref_id: null,
    start: "12:00",
    end: "12:30",
  },

  {_id: 10,
    ref_id: null,
    start: "12:30",
    end: "13:00",
  },

  {_id: 11,
    ref_id: null,
    start: "13:00",
    end: "13:30",
  },

  {_id: 12,
    ref_id: null,
    start: "13:30",
    end: "14:00",
  },

  {_id: 13,
    ref_id: null,
    start: "14:00",
    end: "14:30",
  },

  {_id: 14,
    ref_id: null,
    start: "14:30",
    end: "15:00",
  },

  {_id: 15,
    ref_id: null,
    start: "15:00",
    end: "15:30",
  },

  {_id: 16,
    ref_id: null,
    start: "15:30",
    end: "16:00",
  },

  {_id: 17,
    ref_id: null,
    start: "16:00",
    end: "16:30",
  },

  {_id: 18,
    ref_id: null,
    start: "16:30",
    end: "17:00",
  },

  {_id: 19,
    ref_id: null,
    start: "17:00",
    end: "17:30",
  },

  {_id: 20,
    ref_id: null,
    start: "17:30",
    end: "18:00",
  },

  {_id: 21,
    ref_id: null,
    start: "18:00",
    end: "18:30",
  },

  {_id: 22,
    ref_id: null,
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
      type: [slotSchema],
      required: true,
      default: default_slots,
    },

    doctor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
     }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
