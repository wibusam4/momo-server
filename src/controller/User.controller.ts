import jwt from "jsonwebtoken";
import { showInternal, showMissing, showSuccess } from "../untils";
import bcrypt from "bcrypt";
import config from "../config";
import User from "../model/User.model";
import momo from "../untils/momo";
const saltRounds = 10;
const UserController = {
  register: async (req, res) => {
    try {
      const { username, password, name } = req.body;
      if (!username || !password || !name) {
        return showMissing(res, "Thiếu thông tin!");
      }

      const exitUser = await User.findOne({
        username,
      });
      if (exitUser) {
        return showMissing(res, "User đã tồn tại!");
      }

      const pwHash = await bcrypt
        .hash(password, saltRounds)
        .then((hash) => {
          return hash;
        })
        .catch((err) => console.error(err.message));
      const newUser: any = await User.create({
        name,
        username,
        password: pwHash,
      });
      const token = jwt.sign(
        {
          id: newUser.id,
          username: newUser.username,
          role: newUser.role,
        },
        config.JWT_SECRET || "wibusama",
        {
          expiresIn: "2h",
        }
      );

      return showSuccess(res, token);
    } catch (error) {
      return showInternal(res, error);
    }
  },
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return showMissing(res, "Điền thiếu thông tin");
      }

      const currentUser: any = await User.findOne({ username });

      if (currentUser) {
        const match = await bcrypt
          .compare(password, currentUser.password)
          .then((result) => {
            return result;
          });
        if (match) {
          const token = jwt.sign(
            {
              id: currentUser.id,
              username: currentUser.username,
              role: currentUser.role,
            },
            config.JWT_SECRET,
            {
              expiresIn: "2h",
            }
          );
          return showSuccess(res, { user: currentUser, token });
        }
      }
      return showMissing(res, "Tài khoản hoặc mật khẩu không chính xác");
    } catch (error) {
      return showInternal(res, error);
    }
  },
  momo: async (req, res) => {
    const {phone, password} = req.body
    const data = {
      phone,
      imei: momo.getIMEI(),
      secure_id: momo.getSercureID()
    }
    const value = await momo.getOTP(data)
    return showSuccess(res, value);
  },
};

export default UserController;
