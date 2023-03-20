import jwt from "jsonwebtoken";
import config from "../config";
import { showInternal, showNotFound } from "../untils";
import User from "../model/User.model";

const isLogin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return showNotFound(res, "Required Token");
  }

  try {
    
    const decode: any = jwt.verify(token as string, config.JWT_SECRET);
    if (decode) {
      const currentUser: any = await User.findOne({ _id: decode.id });
      if (currentUser) {
        req.userId = currentUser.id;
        next();
        return;
      }
    }

    return showNotFound(res, "Requried Auth");
  } catch (error) {
    return showInternal(res, error);
  }
};

export default isLogin;
