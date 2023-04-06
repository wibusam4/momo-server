import axios from "axios";
import { appCode, appVer, urlMomo } from "./config";
import crypto from "crypto";
const momo = {
  hashSHA256: (str) => {
    return crypto.createHash("sha256").update(str).digest("hex");
  },

  generateString: (length) => {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const size = characters.length;
    let randomString = "";
    for (let i = 0; i < length; i++) {
      randomString += characters[Math.floor(Math.random() * size)];
    }
    return randomString;
  },

  generateRandom: (length = 20) => {
    return momo.generateString(length);
  },

  generateToken: () => {
    return (
      momo.generateRandom(22) +
      ":" +
      momo.generateRandom(9) +
      "-" +
      momo.generateRandom(20) +
      "-" +
      momo.generateRandom(12) +
      "-" +
      momo.generateRandom(7) +
      "-" +
      momo.generateRandom(7) +
      "-" +
      momo.generateRandom(53) +
      "-" +
      momo.generateRandom(9) +
      "_" +
      momo.generateRandom(11) +
      "-" +
      momo.generateRandom(4)
    );
  },

  generateImei: () => {
    return (
      momo.generateRandom(8) +
      ":" +
      momo.generateRandom(4) +
      "-" +
      momo.generateRandom(4) +
      "-" +
      momo.generateRandom(4) +
      "-" +
      momo.generateRandom(12)
    );
  },

  generateSercureID: (length = 17) => {
    return momo.generateString(length);
  },

  generateCheckSum: (type, microtime, phone, setupKeyDecrypt) => {
    if (setupKeyDecrypt.length < 32) {
      setupKeyDecrypt = setupKeyDecrypt.padEnd(32, "x");
    }
    setupKeyDecrypt = setupKeyDecrypt.substr(0, 32);
    const Encrypt =
      phone + microtime + "000000" + type + microtime / 1000000000000.0 + "E12";
    const iv = Buffer.alloc(16, 0);
    const cipher = crypto.createCipheriv("aes-256-cbc", setupKeyDecrypt, iv);
    let encrypted = cipher.update(Encrypt);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("base64");
  },

  getSetupKey: (setupKey, ohash) => {
    if (ohash.length < 32) {
      ohash = ohash.padEnd(32, "x");
    }
    ohash = ohash.substr(0, 32);
    const iv = Buffer.alloc(16, 0);
    const decipher = crypto.createDecipheriv("aes-256-cbc", ohash, iv);
    let decrypted = decipher.update(Buffer.from(setupKey, "base64"));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  },

  getPasswordHash: (imei, password, setupKeyDecrypt) => {
    if (setupKeyDecrypt.length < 32) {
      setupKeyDecrypt = setupKeyDecrypt.padEnd(32, "x");
    }
    setupKeyDecrypt = setupKeyDecrypt.substr(0, 32);
    const data = `${imei}|${password}`;
    const iv = Buffer.alloc(16, 0); //
    const cipher = crypto.createCipheriv("aes-256-cbc", setupKeyDecrypt, iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString("base64");
  },

  curl: async (url, headers, data) => {
    const config = {
      method: "post",
      url: url,
      headers: headers,
      data: data,
    };
    try {
      const response = (await axios(config)).data;
      console.log(response);

      return response;
    } catch (error) {
      return error;
    }
  },

  getOTP: async (data) => {
    const header = {
      agent_id: "undefined",
      sessionkey: "",
      user_phone: "undefined",
      authorization: "Bearer undefined",
      msgtype: "SEND_OTP_MSG",
      Host: "api.momo.vn",
      "User-Agent": "okhttp/3.14.17",
      app_version: appVer,
      app_code: appCode,
      device_os: "Android",
    };

    await momo.checkUser(data);
    const microtime = Date.now().toString();
    const Data = {
      user: data.phone,
      msgType: "SEND_OTP_MSG",
      cmdId: microtime + "000000",
      lang: "vi",
      time: microtime,
      channel: "APP",
      appVer: appVer,
      appCode: appCode,
      deviceOS: "Android",
      buildNumber: 0,
      appId: "vn.momo.platform",
      result: true,
      errorCode: 0,
      errorDesc: "",
      momoMsg: {
        _class: "mservice.backend.entity.msg.RegDeviceMsg",
        number: data.phone,
        imei: data._doc.imei,
        cname: "Vietnam",
        ccode: "084",
        device: data._doc.deviceId.name,
        firmware: "23",
        hardware: data._doc.deviceId.hardware,
        manufacture: data._doc.deviceId.facture,
        csp: "",
        icc: "",
        mcc: "452",
        device_os: "Android",
        secure_id: data._doc.secureId,
      },
      extra: {
        action: "SEND",
        rkey: data._doc.rkey,
        AAID: data._doc.aaid,
        IDFA: "",
        TOKEN: data._doc.token,
        SIMULATOR: "",
        SECUREID: data._doc.secureId,
        MODELID: data._doc.deviceId.modelId,
        isVoice: false,
        REQUIRE_HASH_STRING_OTP: true,
        checkSum: "",
      },
    };
    const respone = await momo.curl(urlMomo.SEND_OTP_MSG, header, Data);
    return respone;
  },

  checkUser: async (data) => {
    const header = {
      agent_id: "undefined",
      sessionkey: "",
      user_phone: "undefined",
      authorization: "Bearer undefined",
      msgtype: "CHECK_USER_BE_MSG",
      Host: "api.momo.vn",
      "User-Agent": "okhttp/3.14.17",
      app_version: appVer,
      app_code: "",
      device_os: "ANDROID",
    };
    const microtime = Date.now().toString();
    const datas = {
      user: data.phone,
      msgType: "CHECK_USER_BE_MSG",
      cmdId: microtime + "000000",
      lang: "vi",
      time: microtime,
      channel: "APP",
      appVer: appVer,
      appCode: appCode,
      deviceOS: "ANDROID",
      buildNumber: 0,
      appId: "vn.momo.platform",
      result: true,
      errorCode: 0,
      errorDesc: "",
      momoMsg: {
        _class: "mservice.backend.entity.msg.RegDeviceMsg",
        number: data.phone,
        imei: data._doc.imei,
        cname: "Vietnam",
        ccode: "084",
        device: data._doc.deviceId.name,
        firmware: "23",
        hardware: data._doc.deviceId.hardware,
        manufacture: data._doc.deviceId.facture,
        csp: "Viettel",
        icc: "",
        mcc: "452",
        device_os: "Android",
        secure_id: data._doc.secureId,
      },
      extra: {
        checkSum: "",
      },
    };
    const respone = await momo.curl(urlMomo.CHECK_USER_BE_MSG, header, datas);

    return respone;
  },

  checkOtp: async (data) => {
    const header = {
      agent_id: "undefined",
      sessionkey: "",
      user_phone: "undefined",
      authorization: "Bearer undefined",
      msgtype: "REG_DEVICE_MSG",
      Host: "api.momo.vn",
      "User-Agent": "okhttp/3.14.17",
      app_version: appVer,
      app_code: appCode,
      device_os: "Android",
    };

    const microtime = Date.now().toString();
    const Data = {
      user: data.phone,
      msgType: "REG_DEVICE_MSG",
      cmdId: microtime + "000000",
      lang: "vi",
      time: microtime,
      channel: "APP",
      appVer: appVer,
      appCode: appCode,
      deviceOS: "Android",
      buildNumber: 0,
      appId: "vn.momo.platform",
      result: true,
      errorCode: 0,
      errorDesc: "",
      momoMsg: {
        _class: "mservice.backend.entity.msg.RegDeviceMsg",
        number: data.phone,
        imei: data._doc.imei,
        cname: "Vietnam",
        ccode: "084",
        device: data._doc.deviceId.name,
        firmware: "23",
        hardware: data._doc.deviceId.hardware,
        manufacture: data._doc.deviceId.facture,
        csp: "",
        icc: "",
        mcc: "452",
        device_os: "Android",
        secure_id: data._doc.secureId,
      },
      extra: {
        ohash: data.ohash,
        AAID: data._doc.aaid,
        IDFA: "",
        TOKEN: data._doc.token,
        SIMULATOR: "",
        SECUREID: data._doc.secureId,
        MODELID: data._doc.deviceId.modelId,
        checkSum: "",
      },
    };
    const respone = await momo.curl(urlMomo.REG_DEVICE_MSG, header, Data);
    return respone;
  },

  loginUser: async (data) => {
    const header = {
      agent_id: "undefined",
      user_phone: data.phone,
      sessionkey: "",
      authorization: "Bearer undefined",
      msgtype: "USER_LOGIN_MSG",
      Host: "owa.momo.vn",
      "User-Agent": "okhttp/3.14.17",
      app_version: appVer,
      app_code: appCode,
      device_os: "ANDROID",
    };
    const microtime = Date.now().toString();
    const Data = {
      user: data.phone,
      msgType: "USER_LOGIN_MSG",
      pass: data.password,
      cmdId: microtime + "000000",
      lang: "vi",
      time: microtime,
      channel: "APP",
      appVer: appVer,
      appCode: appCode,
      deviceOS: "Android",
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
        pHash: momo.getPasswordHash(
          data._doc.imei,
          data.password,
          data._doc.setupKeyDecrypt
        ),
        AAID: data._doc.aaid,
        IDFA: "",
        TOKEN: data._doc.token,
        SIMULATOR: "",
        SECUREID: data._doc.secureId,
        MODELID: data._doc.deviceId.modelId,
        checkSum: momo.generateCheckSum(
          "USER_LOGIN_MSG",
          microtime,
          data.phone,
          data._doc.setupKeyDecrypt
        ),
      },
    };
    const respone = await momo.curl(urlMomo.USER_LOGIN_MSG, header, Data);
    return respone;
  },

  GENERATE_TOKEN_AUTH_MSG: async (data) => {
    const header = {
      agent_id: data.agentId,
      user_phone: data.phone,
      sessionkey: data.sessionKey ?? "",
      authorization: `Bearer ${data.authorization}`,
      msgtype: "GENERATE_TOKEN_AUTH_MSG",
      Host: "api.momo.vn",
      user_id: data.phone,
      "User-Agent": "MoMoPlatform-Release/31062 CFNetwork/1325.0.1 Darwin/21.1.0",
      app_version: appVer,
      app_code: appCode,
      device_os: "ANDROID",
    };
    const microtime = Date.now().toString();
    const Data = {
      user: data.phone,
      msgType: "GENERATE_TOKEN_AUTH_MSG",
      cmdId: microtime + "000000",
      lang: "vi",
      time: microtime,
      channel: "APP",
      appVer: appVer,
      appCode: appCode,
      deviceOS: "Android",
      buildNumber: 0,
      appId: "vn.momo.platform",
      result: true,
      errorCode: 0,
      errorDesc: "",
      momoMsg: {
        _class: "mservice.backend.entity.msg.RefreshTokenMsg",
        refreshToken: data.refreshToken,
      },
      extra: {
        pHash: momo.getPasswordHash(
          data.imei,
          data.password,
          data.setupKeyDecrypt
        ),
        AAID: data.aaid,
        IDFA: "",
        TOKEN: data.token,
        SIMULATOR: "",
        SECUREID: data.secureId,
        MODELID: data.deviceId.modelId,
        checkSum: momo.generateCheckSum(
          "USER_LOGIN_MSG",
          microtime,
          data.phone,
          data.setupKeyDecrypt
        ),
      },
    };
    const respone = await momo.curl(urlMomo.GENERATE_TOKEN_AUTH_MSG, header, Data);
    return respone;
  },
};
export default momo;
