const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Deviceschema = new Schema(
  {
    name: { type: String, require: true },
    hardware: { type: String, required: true },
    facture: { type: String, required: true },
    modelID: { type: String, required: true },
  },
  { timestamps: true }
);

const Device = mongoose.model("device", Deviceschema);

export default Device;
