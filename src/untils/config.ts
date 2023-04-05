const apiMomo = "https://api.momo.vn/backend";
const owaMomo = "https://owa.momo.vn";

export const appCode = "4.0.18";

export const appVer = 40181;

export const urlMomo = {
  CHECK_USER_BE_MSG: `${apiMomo}/auth-app/public/CHECK_USER_BE_MSG`, //Check người dùng
  SEND_OTP_MSG: `${apiMomo}/otp-app/public/`, //Gửi OTP
  REG_DEVICE_MSG: `${apiMomo}/otp-app/public/`, // Xác minh OTP
  QUERY_TRAN_HIS_MSG: `${owaMomo}/api/QUERY_TRAN_HIS_MSG`, // Check ls giao dịch
  USER_LOGIN_MSG: `${owaMomo}/public/login`, // Đăng Nhập
  GENERATE_TOKEN_AUTH_MSG: `${apiMomo}/auth-app/public/GENERATE_TOKEN_AUTH_MSG`, // Get Token
  QUERY_TRAN_HIS_MSG_NEW: `https://m.mservice.io/hydra/v2/user/noti`, // check ls giao dịch
  M2MU_INIT: `${owaMomo}/api/M2MU_INIT`, // Chuyển tiền
  M2MU_CONFIRM: `${owaMomo}/api/M2MU_CONFIRM`, // Chuyển tiền
  BANK_OTP: `${owaMomo}/api/BANK_OTP`, // Rút tiền
};
