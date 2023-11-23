const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema(
    {
        name: {
          type: String,
          require: true,
        },
    
        count: {
          type: Number,
          require: true,
          default: 0,
        },
    
        route_path: {
          type: String,
          require: true,
        },
    
        description: {
          type: String,
          maxLength: 200,
        },
    
        created_at: { type: Date, required: true, default: Date.now },
        created_by: {
          type: String,
          required: true,
        },
    
      },
      { timestamps: true }
    );

module.exports = mongoose.model("Category", categorySchema);