const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slot = require("./slot.model");

const appointmentSchema = new mongoose.Schema(
    {
        'name' : String,
        'email' : String,
        'slots' : {type: mongoose.Schema.Types.ObjectId, ref: 'slot'},
    
      },
      { timestamps: true }
    );

module.exports = mongoose.model("Appointment", appointmentSchema);