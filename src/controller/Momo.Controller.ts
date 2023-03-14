import { response } from "express";
import Device from "../model/Device.model";
import Momo from "../model/Momo.model";
import { showInternal, showMissing, showSuccess } from "../untils";
import momo from "../untils/momo";

const MomoController = {
  add: async (req, res) => {
    const { phone, otp, password, action } = req.body;
    let findMomo = Momo;
    let data = {};
    switch (action) {
      case "GET-OTP":
        if (!phone) return showMissing(res, "Nhập số điện thoại!");
        const dataPhone = await Momo.findOne({ phone });
        if (!dataPhone) {
          const pipeline = [{ $sample: { size: 1 } }];
          const device = await Device.aggregate(pipeline)
            .exec()
            .then((result) => {
              return result;
            });
          await Momo.create({
            phone,
            userId: req.body.userId,
            imei: momo.generateImei(),
            secureId: momo.generateSercureID(),
            rkey: momo.generateRandom(20),
            aaid: momo.generateImei(),
            token: momo.generateToken(),
            deviceId: device[0]._id,
            status: "pending",
          });
        }
        findMomo = await Momo.findOne({ phone }).populate("deviceId");
        data = {
          phone,
          ...findMomo,
        };
        const value = await momo.getOTP(data);
        if (value.errorCode == 0) {
          showSuccess(res, value.errorDesc);
        } else {
          showMissing(res, value.errorDesc);
        }
        break;
      case "CHECK-OTP":
        try {
          if (!phone) return showMissing(res, "Nhập số điện thoại!");
          if (!otp) return showMissing(res, "Nhập OTP!");
          if (!password) return showMissing(res, "Nhập mật khẩu!");
          findMomo = await Momo.findOne({ phone }).populate("deviceId");
          const ohash = momo.hashSHA256(`${phone}${findMomo.rkey}${otp}`);
          data = {
            phone,
            ohash,
            ...findMomo,
          };
          let respone = await momo.checkOtp(data);
          console.log(respone);
          
          findMomo = await Momo.findByIdAndUpdate(
            { _id: findMomo.id },
            {
              ohash,
              setupKey: respone.extra.setupKey,
              status: "success",
              setupKeyDecrypt: momo.getSetupKey(
                respone.extra.setupKey,
                respone.extra.ohash
              ),
            },
            { new: true }
          );
          data = {
            phone,
            password,
            ...findMomo,
          };
          respone = await momo.loginUser(data);
          showSuccess(res, respone);
        } catch (error) {
          showInternal(res, error);
        }
        break;
      case "TEST":
        const pipeline = [{ $sample: { size: 1 } }];
        const device = await Device.aggregate(pipeline)
          .exec()
          .then((result) => {
            return result;
          });
        console.log(device[0].id);

        return showSuccess(res, device[0]._id);
      default:
        showMissing(res, "Có lỗi xảy ra");
        break;
    }
  },
};

export default MomoController;
