const apiMomo = "https://api.momo.vn/backend";

export const appCode = "4.0.11";

export const appVer = 40122;

export const urlMomo = {
  CHECK_USER_BE_MSG: `${apiMomo}/auth-app/public/CHECK_USER_BE_MSG`, //Check người dùng
  SEND_OTP_MSG: `${apiMomo}/otp-app/public/`, //Gửi OTP
  REG_DEVICE_MSG: `${apiMomo}/otp-app/public/`, // Xác minh OTP
  QUERY_TRAN_HIS_MSG: `https://owa.momo.vn/api/QUERY_TRAN_HIS_MSG`, // Check ls giao dịch
  USER_LOGIN_MSG: `https://owa.momo.vn/public/login`, // Đăng Nhập
  GENERATE_TOKEN_AUTH_MSG: `${apiMomo}/auth-app/public/GENERATE_TOKEN_AUTH_MSG`, // Get Token
  QUERY_TRAN_HIS_MSG_NEW: `https://m.mservice.io/hydra/v2/user/noti`, // check ls giao dịch
  M2MU_INIT: `https://owa.momo.vn/api/M2MU_INIT`, // Chuyển tiền
  M2MU_CONFIRM: `https://owa.momo.vn/api/M2MU_CONFIRM`, // Chuyển tiền
  BANK_OTP: `https://owa.momo.vn/api/BANK_OTP`, // Rút tiền
};
