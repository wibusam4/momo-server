import Device from "../model/Device.model";
import Momo from "../model/Momo.model";
import User from "../model/User.model";
import { showInternal, showMissing, showSuccess } from "../untils";
import momo from "../untils/momo";

const MomoController = {
    add: async (req, res) => {
        const { phone, otp, password, action } = req.body;
        const userId = req.userId;
        let findMomo = Momo;
        let data = {};
        switch (action) {
          case "GET-OTP":
            try {
              if (!phone) return showMissing(res, "Nhập số điện thoại!");
              const limit = await Promise.all([
                Momo.countDocuments({ userId }),
                User.find({ _id: userId }),
              ]);
              if (limit) {
                if (limit[0] > limit[1][0].limit)
                  return showMissing(res, "Đạt giới hạn thêm tài khoản!");
              }
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
                  userId,
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
              if (value.errorCode != 0) return showMissing(res, value.errorDesc);
              showSuccess(res, value.errorDesc);
            } catch (error) {
              showInternal(res, error);
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
    
              if (respone.errorCode != 0)
                return showMissing(res, respone.errorDesc);
    
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
              if (respone.errorCode != 0)
                return showMissing(res, respone.errorDesc);
              await Momo.findByIdAndUpdate(
                { _id: findMomo.id },
                {
                  password,
                  authorization: respone.extra.AUTH_TOKEN,
                  bankVerify: respone.momoMsg.bankVerifyPersonalid,
                  agentId: respone.momoMsg.agentId,
                  rsaPublicKey: respone.extra.REQUEST_ENCRYPT_KEY,
                  name: respone.extra.FULL_NAME,
                  balance: respone.extra.BALANCE,
                  refreshToken: respone.extra.REFRESH_TOKEN,
                  sessionKey: respone.extra.SESSION_KEY,
                  partnerCode: respone.momoMsg.bankCode,
                  errorDesc: respone.errorDesc,
                  status: "success",
                  timeLogin: Date.now(),
                },
                { new: true }
              );
              showSuccess(res, "Xác nhận otp thành công!");
            } catch (error) {
              showInternal(res, error);
            }
            break;
    
          default:
            showMissing(res, "Có lỗi xảy ra");
            break;
        }
      },
    
      get: async (req, res) => {
        try {
          const userId = req.userId;
          const momo = await Momo.find({
            userId,
          }).select("phone balance name timeLogin ");
          return showSuccess(res, momo);
        } catch (error) {
          return showInternal(req, error);
        }
      },
    
      delete: async (req, res) => {
        try {
          const { id } = req.body;
          const userId = req.userId;
          if (!id || !userId) return showMissing(res, "Bạn bị ban!");
          const data = await Momo.findOneAndDelete({ _id: id, userId });
          if (data) return showSuccess(res, "Xóa thành công!");
          return showMissing(res, "Không tìm thấy số điện thoại!");
        } catch (error) {
          showInternal(res, error);
        }
      },
};

export default MomoController;
