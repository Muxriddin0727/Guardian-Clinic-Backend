const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const slotSchema = new mongoose.Schema(
    {
        'slot_time' : String,
        'slot_date' : String,
    
      },
      { timestamps: true }
    );

module.exports = mongoose.model("Slot", slotSchema);