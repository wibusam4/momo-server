import { createHash } from "node:crypto";
import crypto from "crypto";
import forge from "node-forge";
import axios from "axios";
const https = require("https");

const momo = {
  getMicrotime: () => {
    const hrTime = process.hrtime();
    return hrTime[0] * 1000000 + hrTime[1] / 1000;
  },

  getRkey: ($length) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const size = chars.length;
    let str = "";
    for (let index = 0; index < size; index++) {
      str += chars[index];
    }
    return str;
  },

  getIMEI: () => {
    const time = createHash("md5")
      .update(momo.getMicrotime().toString())
      .digest("hex");
    let text = time.substr(0, 8) + "-";
    text += time.substr(8, 4) + "-";
    text += time.substr(12, 4) + "-";
    text += time.substr(16, 4) + "-";
    text += time.substr(17, 12);
    return text;
  },

  getSercureID: (length = 17) => {
    const characters = "0123456789abcde";
    const charactersLength = characters.length;
    let randomString = "";
    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * charactersLength - 1)
      );
    }
    return randomString;
  },

  encryptDecrypt: (data, key, mode = "ENCRYPT") => {
    if (key.length < 32) {
      key = key.padEnd(32, "x");
    }
    key = key.substr(0, 32);
    const iv = Buffer.alloc(16, 0);
    if (mode === "ENCRYPT") {
      const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
      let encrypted = cipher.update(data, "utf8", "base64");
      encrypted += cipher.final("base64");
      return encrypted;
    } else {
      const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
      let decrypted = decipher.update(data, "base64", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    }
  },

  getPHash: (data) => {
    const pHashSyntax = `${data.imei}|${data.pwd}`;
    const decryptedKey = momo.encryptDecrypt(
      data.setupkey,
      data.ohash,
      "DECRYPT"
    );
    return momo.encryptDecrypt(pHashSyntax, decryptedKey);
  },

  encodeRSA: (content, key) => {
    const publicKey = forge.pki.publicKeyFromPem(key);
    const encrypted = publicKey.encrypt(content);
    return Buffer.from(encrypted, "binary").toString("base64");
  },

  getCheckSum: (data, type) => {
    const currentTime = momo.getMicrotime();
    const checkSumSyntax = `${data.phone}${currentTime}000000${type}${
      currentTime / 1000000000000.0
    }E12`;
    const decryptedKey = momo.encryptDecrypt(
      data.setupkey,
      data.ohash,
      "DECRYPT"
    );
    return momo.encryptDecrypt(checkSumSyntax, decryptedKey);
  },

  curlMomo: async (url, headers, data) => {
    if (Array.isArray(data)) {
      data = JSON.stringify(data);
    }
    const options = {
      method: "POST",
      data: data,
      headers: headers,
      url: url,
    };
    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  getOTP: async (data) => {
    const url = "https://api.momo.vn/backend/otp-app/public/SEND_OTP_MSG";
    const data_body = {
      user: data.phone,
      msgType: "SEND_OTP_MSG",
      cmdId: momo.getMicrotime() + "000000",
      lang: "vi",
      time: momo.getMicrotime(),
      channel: "APP",
      appVer: 31090,
      appCode: "3.1.9",
      deviceOS: "ANDROID",
      buildNumber: 0,
      appId: "vn.momo.platform",
      result: true,
      errorCode: 0,
      errorDesc: "",
      momoMsg: {
        _class: "mservice.backend.entity.msg.RegDeviceMsg",
        number: data.phone,
        imei: data.imei,
        cname: "Vietnam",
        ccode: "084",
        device: "G011A",
        firmware: "22",
        hardware: "intel",
        manufacture: "google",
        csp: "Vinaphone",
        icc: "",
        mcc: "452",
        device_os: "Android",
        secure_id: data.secure_id,
      },
      extra: {
        action: "SEND",
        rkey: data.rkey,
        AAID: "",
        IDFA: "",
        TOKEN: "",
        SIMULATOR: "true",
        SECUREID: data.secure_id,
        MODELID: "google g011aintel41338011",
        isVoice: "true",
        REQUIRE_HASH_STRING_OTP: true,
        checkSum: "",
      },
    };

    const headers = {
      host: "api.momo.vn",
      accept: "application/json",
      app_version: "31090",
      app_code: "3.1.9",
      device_os: "ANDROID",
      agent_id: "undefined",
      sessionkey: "",
      sessionkey_v2: "",
      user_phone: "undefined",
      lang: "vi",
      authorization: "Bearer undefined",
      "x-firebase-appcheck": "error getAppCheckToken failed in last 5m",
      msgtype: "SEND_OTP_MSG",
      "content-type": "application/json",
      "content-length": "1055",
      "accept-encoding": "gzip",
      "user-agent": "okhttp/4.9.0",
    };

    try {
      const response = await axios.post(url, data_body, {
        headers: headers,
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });

      return response.data;
    } catch (error) {
      console.error(error);
    }
  },

  hash_sha256: (str) => {
    const crypto = require("crypto");
    return crypto.createHash("sha256").update(str).digest("hex");
  },

  checkOTP: (data) => {
    const data_body = {
      user: data.phone,
      msgType: "REG_DEVICE_MSG",
      cmdId: momo.getMicrotime() + "000000",
      lang: "vi",
      time: momo.getMicrotime(),
      channel: "APP",
      appVer: 31090,
      appCode: "3.1.9",
      deviceOS: "ANDROID",
      buildNumber: 0,
      appId: "vn.momo.platform",
      result: true,
      errorCode: 0,
      errorDesc: "",
      momoMsg: {
        _class: "mservice.backend.entity.msg.RegDeviceMsg",
        number: data.phone,
        imei: data.imei,
        cname: "Vietnam",
        ccode: "084",
        device: "G011A",
        firmware: "22",
        hardware: "intel",
        manufacture: "google",
        csp: "Vinaphone",
        icc: "",
        mcc: "452",
        device_os: "Android",
        secure_id: data.secure_id,
      },
      extra: {
        ohash: momo.hash_sha256(data.phone + data.rkey + data.otp),
        AAID: "",
        IDFA: "",
        TOKEN: "",
        SIMULATOR: "false",
        SECUREID: data.secure_id,
        MODELID: "google g011aintel41338011",
        checkSum: "",
      },
    };

    const url = "https://api.momo.vn/backend/otp-app/public/REG_DEVICE_MSG";
    const headers = {
      host: "api.momo.vn",
      accept: "application/json",
      app_version: "31090",
      app_code: "3.1.9",
      device_os: "ANDROID",
      agent_id: "undefined",
      sessionkey: "",
      sessionkey_v2: "",
      user_phone: "undefined",
      lang: "vi",
      authorization: "Bearer undefined",
      "x-firebase-appcheck": "error getAppCheckToken failed in last 5m",
      msgtype: "REG_DEVICE_MSG",
      "content-type": "application/json",
      "content-length": "1014",
      "accept-encoding": "gzip",
      "user-agent": "okhttp/4.9.0",
    };
    const response = momo.curlMomo(url, headers, data_body);
    return response;
  },

  loginMomo: (data) => {
    const data_body = {
      user: data["phone"],
      msgType: "USER_LOGIN_MSG",
      pass: data["pwd"],
      cmdId: momo.getMicrotime() + "000000",
      lang: "vi",
      time: momo.getMicrotime(),
      channel: "APP",
      appVer: 31090,
      appCode: "3.1.9",
      deviceOS: "ANDROID",
      buildNumber: 0,
      appId: "vn.momo.platform",
      result: true,
      errorCode: 0,
      errorDesc: "",
      momoMsg: {
        _class: "mservice.backend.entity.msg.LoginMsg",
        isSetup: false,
      },
      extra: {
        pHash: momo.getPHash(data),
        AAID: "",
        IDFA: "",
        TOKEN: "",
        SIMULATOR: "true",
        SECUREID: data["secure_id"],
        MODELID: "google g011aintel41338011",
      },
    };

    const url = "https://owa.momo.vn/public/login";
    const headers = {
      Host: "api.momo.vn",
      Accept: "application/json",
      app_version: "31090",
      app_code: "3.1.9",
      device_os: "ANDROID",
      agent_id: "undefined",
      sessionkey: "",
      sessionkey_v2: "",
      user_phone: "undefined",
      lang: "vi",
      authorization: "Bearer undefined",
      "x-firebase-appcheck": "error getAppCheckToken failed in last 5m",
      msgtype: "REG_DEVICE_MSG",
      "Content-Type": "application/json",
      "Content-Length": "1014",
      "Accept-Encoding": "gzip",
      "User-Agent": "okhttp/4.9.0",
    };
    const response = momo.curlMomo(url, headers, data_body);

    return response;
  },

  historyMomo: (data, hours = 24) => {
    const requestkeyRaw = momo.getRkey(32);
    const requestkey = momo.encodeRSA(requestkeyRaw, data.encrypt_key);
    const data_post = {
      user: data.phone,
      msgType: "QUERY_TRAN_HIS_MSG",
      cmdId: `${momo.getMicrotime()}000000`,
      lang: "vi",
      channel: "APP",
      time: momo.getMicrotime(),
      appVer: 31090,
      appCode: "3.1.9",
      deviceOS: "ANDROID",
      result: true,
      errorCode: 0,
      errorDesc: "",
      extra: {
        checkSum: momo.getCheckSum(data, "QUERY_TRAN_HIS_MSG"),
      },
      momoMsg: {
        _class: "mservice.backend.entity.msg.QueryTranhisMsg",
        begin: (Date.now() - 3600 * hours) * 1000,
        end: momo.getMicrotime(),
      },
    };
    const url = "https://owa.momo.vn/api/sync/QUERY_TRAN_HIS_MSG";
    const headers = {
      Msgtype: "QUERY_TRAN_HIS_MSG",
      Accept: "application/json",
      "Content-Type": "application/json",
      requestkey: requestkey,
      userid: data.phone,
      Authorization: `Bearer ${data.auth_token}`,
    };
    const response = momo.curlMomo(
      url,
      headers,
      momo.encryptDecrypt(data_post, requestkeyRaw)
    );
    if (!response) {
      return false;
    }
    const result = momo.encryptDecrypt(response, requestkeyRaw, "DECRYPT");
    return result;
  },
};
export default momo;
