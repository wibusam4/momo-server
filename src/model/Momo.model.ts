const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Momoschema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
    deviceId: { type: mongoose.Types.ObjectId, ref: "device" },
    phone: { type: Number, require: true, unique: true },
    password: { type: String, required: false },
    name: { type: String, required: false },
    imei: { type: String, required: false },
    aaid: { type: String, required: false },
    token: { type: String, required: false },
    ohash: { type: String, required: false },
    secureId: { type: String, required: false },
    rkey: { type: String, required: false },
    authorization: { type: String, required: false },
    refreshToken: { type: String, required: false },
    agentId: { type: String, required: false },
    setupKeyDecrypt: { type: String, required: false },
    setupKey: { type: String, required: false },
    sessionKey: { type: String, required: false },
    rsaPublicKey: { type: String, required: false },
    balance: { type: String, required: false },
    bankVerify: { type: String, required: false },
    partnerCode: { type: String, required: false },
    timeLogin: { type: String, required: false },
    errorDesc: { type: String, required: false },
    status: { type: String, required: false },

  },
  { timestamps: true }
);

const Momo = mongoose.model("momo_account", Momoschema);

export default Momo;
