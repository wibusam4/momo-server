const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Userschema = new Schema(
  {
    name: { type: String, require: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, default: 1 },
    money: { type: Number, default: 0 },
    status: { type: String, default: "Active" },
    limit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model("users", Userschema);

export default User;
