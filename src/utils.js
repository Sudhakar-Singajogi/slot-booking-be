const dateTime = require("node-datetime");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("7b75a472b65bc4a42e7b3f7883");
const winston = require("winston");
const mysql = require("mysql2");
const crypto = require("crypto");
const algorithm = "aes-256-cbc"; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const path = require("path");
const APPCONSTANTS = require(path.resolve("appconstants"));
var randomstring = require("randomstring");
const sequelize = require(path.resolve("src/dbconn/", "connection"));
const Sequelize = require("sequelize");
const fs = require("fs");
const nodemailer = require("nodemailer");
const Op = Sequelize.Op;

const getDateTime = () => {
  const dt = dateTime.create();
  return dt.format("Y-m-d H:M:S");
};

async function returnResult(
  type,
  object,
  customMsg = null,
  totalRecords = null
) {
  // console.log("got obj as", object);
  if (
    object &&
    !object.hasOwnProperty("ValidationErrors") &&
    !object.hasOwnProperty("DBErrors")
  ) {
    return customMsg != null
      ? { message: customMsg, result: [] }
      : {
          message: customMsg != null ? customMsg : "Query Success",
          result: object,
          totalRows: totalRecords > 0 ? totalRecords : 0,
        };
  } else {
    if (object && object.hasOwnProperty("ValidationErrors")) {
      return customMsg != null
        ? { message: customMsg, result: ["ssr"] }
        : {
            message: "Validation Errors",
            result: object,
            totalRows: 0,
          };
    }

    if (object && object.hasOwnProperty("DBErrors")) {
      return customMsg != null
        ? { message: customMsg, result: [] }
        : {
            message: "DB operation failed",
            result: object,
            totalRows: 0,
          };
    }
    return customMsg != null
      ? { message: customMsg, result: [] }
      : {
          message: type + " does not exists",
          result: [],
          totalRows: 0,
        };
  }
}

async function retrunResponse(res, Obj) {
  console.log("got object as ", Obj);
  let ValidationErrors = "";

  let resultCode = 200;

  if (Obj.message.includes("You are not allowed to change")) {
    resultCode = 401;
  }
  if (Obj.message.includes("Duplicate entry")) {
    resultCode = 200;
    Obj.message = Obj.message.split(" for key")[0].replace(/'/g, "");
  }
  if (Obj.message.includes("Validation Errors")) {
    resultCode = 200;
    Obj.message = Obj.message.split(" for key")[0].replace(/'/g, "");
    ValidationErrors = Obj.result.ValidationErrors;
    Obj.result = [];
  }

  if (Obj.message.includes("DB operation failed")) {
    resultCode = 200;
    Obj.message = Obj.message.split(" for key")[0].replace(/'/g, "");
    ValidationErrors = Obj.result.DBErrors;
    Obj.result = [];
  }

  if (Obj.message.includes("Unauthorized")) {
    resultCode = 401;
    Obj.message = Obj.message.split(" for key")[0].replace(/'/g, "");
  }

  data = Obj.result.hasOwnProperty("resultSet")
    ? Obj.result.resultSet
    : Obj.result;
  resultTotal = Obj.result.hasOwnProperty("resultSet")
    ? Obj.result.resultSet.length
    : Obj.result.length;
  hasMore = Obj.result.hasOwnProperty("resultSet")
    ? Obj.totalRows > Obj.result.resultSet.length
    : Obj.totalRows > Obj.result.length;

  console.log("res obj is:", res);

  return res.status(resultCode).json({
    result: "OK",
    resultCode: resultCode,
    message: Obj.message,
    ValidationErrors: ValidationErrors,
    data: data,
    resultTotal: resultTotal,
    totalRows: Obj.totalRows,
    hasMore: hasMore,
  });
}

const encrypt = (text) => cryptr.encrypt(text);
const decrypt = (encText) => cryptr.decrypt(encText);

async function setTokenParams(userid, accessToken, refreshToken) {
  return {
    userId: userid,
    accessToken: accessToken,
    refreshToken: refreshToken,
    status: "Active",
  };
}

//generate random string
async function generateRandomString(len) {
  return randomstring.generate(len);
}

async function checkACL(feature, functionality, userDetails) {
  console.log("functionality", functionality);
  let acl = "NA";
  if (feature !== null && functionality !== null) {
    //check whether the use has access to this feature or not

    let permi = userDetails.result.Role.Permission.permissionList;
    if (typeof permi === "string") {
      permi = permi.replace("[", "");
      permi = permi.replace("]", "");

      permi = JSON.parse(permi);
    } else {
      permi = permi[0];
    }
    console.log(permi);

    let acl = "NA";
    for (var key in permi) {
      if (key == feature) {
        acl = permi[key];
        break;
      }
    }
    console.log("ACL", acl);
    console.log(functionality);

    if (acl !== "NA") {
      if (functionality === "Create" || functionality === "Update") {
        if (acl.includes("RW")) {
          return acl;
        }
      } else if (functionality === "Execute") {
        if (acl === "RWX") {
          return acl;
        }
      } else if (functionality === "Read") {
        if (acl.includes("R")) {
          console.log(3);
          return acl;
        }
      }
    }
    return "NA";
  }
  return acl;
}

async function catchError(feature, err) {
  await logToWinston({
    Query: JSON.parse(JSON.stringify(err.original)).sql,
    SQLMessage: JSON.parse(JSON.stringify(err.original)).sqlMessage,
  });
  return await returnResult(
    feature,
    false,
    JSON.parse(JSON.stringify(err.original)).sqlMessage
  );
}

async function logErrorMsg(feature, errMsg, notify = false) {
  if (notify) {
    await logToWinston({
      "Notification Msg": errmsg,
    });
  } else {
    await logToWinston({
      ErrorMessage: errmsg,
    });
  }
  return await returnResult(feature, false, errmsg);
}
async function logToWinston(errMsg) {
  const logger = winston.createLogger({
    transports: [
      //new winston.transports.Console(),
      new winston.transports.File({ filename: "errorLogs.log" }),
    ],
  });

  logger.log({
    level: "error",
    message: errMsg,
  });
}

async function checkBaseUser(userId) {
  const user = await userModel.findByPk(userId, {
    attributes: {
      exclude: ["password", "createdAt", "updatedAt"],
    },
  });
  return user;
}

async function loglastExecuteQueryToWinston(feature, query) {
  console.log("last executed Query:" + query);
  const logger = winston.createLogger({
    transports: [
      //new winston.transports.Console(),
      new winston.transports.File({ filename: "lastexecutedqueriesLogs.log" }),
    ],
  });

  logger.log({
    level: "info",
    message: {
      feature: feature,
      Query: query.replace("Executing (default): ", ""),
    },
  });
}

async function getrolebasedPermissions(roleId) {
  let slectedFields = "fea.module, per.read, per.write, per.delete";
  let qry =
    "SELECT " +
    slectedFields +
    " FROM assigned_permissionto_roles as asp join permissions as per on per.permissionId=asp.permissionId join modules as fea on fea.moduleId=per.moduleId where asp.roleId=:roleId";
  await loglastExecuteQueryToWinston("schools", qry.replace(":roleId", roleId));

  return await sequelize
    .query(qry, {
      replacements: { roleId: roleId },
      type: sequelize.QueryTypes.SELECT,
    })
    .then((rolebasedPermissionsArr) => {
      return rolebasedPermissionsArr;
    });
}

//check whether the user has access to this feature
function checkFeatureAccessability(
  rolebasedPermissions,
  feature,
  functionality
) {
  let hasAccess = false;
  rolebasedPermissions.forEach((obj) => {
    if (obj.module == feature) {
      switch (functionality) {
        case "read":
          if (obj.read == "1") {
            hasAccess = true;
          }
          break;
        case "write":
          if (obj.write == "1") {
            hasAccess = true;
          }
          break;
        case "delete":
          if (obj.delete == "1") {
            hasAccess = true;
          }
          break;
      }
    }
  });
  return hasAccess;
}

async function checkOffSetLimit(feature, offset, limit, totalResults) {
  if (
    typeof parseInt(offset) == "number" &&
    typeof parseInt(limit) == "number" &&
    parseInt(offset) >= 0 &&
    parseInt(limit) >= 0
  ) {
    var offSet = offset != "" ? parseInt(offset) : 0;

    if (offSet > totalResults) {
      return ["No records found"];
    }
  } else {
    return ["Invalid offset or limit"];
  }
  return parseInt(offSet);
}

async function getAField(cond, field, model, tableName, excludeFields) {
  try {
    const sectionField = await model.findOne({
      where: cond,
      limit: 1,
      attributes: {
        exclude: excludeFields,
        include: [field],
      },
      logging: (sql, queryObject) => {
        loglastExecuteQueryToWinston(
          "Get a " + field + " from " + tableName + " table",
          sql
        );
      },
    });

    return sectionField;
  } catch (err) {
    return 0;
  }
}

async function checkRowExists(cond, model, message, groupby = false) {
  try {
    const totalRows = await model.count({
      where: cond,
      logging: (sql, queryObject) => {
        loglastExecuteQueryToWinston(message, sql);
      },
    });

    if (groupby !== false) {
      const totalRows = await model.count({
        where: cond,
        group: groupby,
        logging: (sql, queryObject) => {
          loglastExecuteQueryToWinston(message, sql);
        },
      });
    }

    return totalRows;
  } catch (err) {
    console.log("error is: ", err);
    return 0;
  }
}

async function getTotalRows(
  cond,
  model,
  message,
  excludeFields,
  groupby = false
) {
  return checkRowExists(cond, model, message, groupby);
}

async function fetchRows(obj) {
  const model = obj.model;
  try {
    console.log("fetchCondi:", obj.fetchRowsCond);

    var params = {
      where: obj.fetchRowsCond,
      attributes: {
        exclude: obj.excludeFields,
      },
      logging: (sql, queryObject) => {
        loglastExecuteQueryToWinston(obj.msg, sql);
      },
    };
    if (obj.hasOwnProperty("includes")) {
      params.include = obj.includes;
    }
    if (obj.hasOwnProperty("limit")) {
      params.offset = obj.offSet;
      params.limit = obj.limit != "" ? parseInt(obj.limit) : 10;
    }
    if (obj.hasOwnProperty("orderBy")) {
      params.order = obj.orderBy.length > 0 ? [obj.orderBy] : [];
    }
    const resultSet = await model.findAll(params);
    return {
      success: true,
      message: "Success",
      resultSet: resultSet,
    };
  } catch (e) {
    return {
      success: false,
      message: "Failed to fetch data",
      errorMs: e,
    };
  }
}

async function getRowByPk(obj) {
  const model = obj.model;
  console.log("object:", obj);
  console.log("model:", model);
  try {
    const resSet = await model.findOne({
      where: obj.fetchRowCond,
      attributes: {
        exclude: obj.excludeFields,
      },
    });
    return {
      success: true,
      resultSet: resSet,
    };
  } catch (e) {
    return {
      success: false,
      message: "Failed to fetch data",
      errorMs: e,
    };
  }
}

async function bulkInsertUpdate(paramObj) {
  try {
    const model = paramObj.model;
    console.log("paramObj:", paramObj);
    console.log("updateOnDuplicateFields:", paramObj.updateOnDuplicateFields);

    const resultSet = await model
      .bulkCreate(
        paramObj.data,
        paramObj.insertUpdate == "update"
          ? { updateOnDuplicate: paramObj.updateOnDuplicateFields }
          : { returning: true }
      )
      .then(async () => {
        return await fetchRows(paramObj);
      });
    return resultSet ? resultSet : [];
  } catch (err) {
    console.log("failed to insert bulk data");
    return {
      success: false,
      resultSet: { FailedToCreate: true },
      message: "Failed to Insert data",
      errorMs: "Failed to Insert data",
    };
  }
}

function getMinYear(minusYears) {
  var res = new Date(
    new Date().setFullYear(new Date().getFullYear() - minusYears)
  );
  var minYearDate = res
    .toLocaleString("en-us", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2");
  var getYear = minYearDate.split("-");
  return getYear[0] + "-01-01";
}

async function getTableColumns(
  Model,
  include_exclude = "include",
  excludecreatedupdatedAt = false
) {
  var tableColumns = [];
  for (let key in Model.rawAttributes) {
    console.log("column is ", key);
    if (include_exclude == "include") {
      if (excludecreatedupdatedAt) {
        if (key == "createdAt" || key == "updatedAt") {
        } else {
          tableColumns.push(key);
        }
      } else {
        tableColumns.push(key);
      }
    } else if (include_exclude == "exclude" && !excludecreatedupdatedAt) {
      if (key == "createdAt" || key == "updatedAt") {
        tableColumns.push(key);
      }
    }
  }

  return tableColumns;
}

async function getElementsInArrays(allFields, fieldsToUpdate, val) {
  //if val is -1 then this will return differnce of elements in the two arrays
  //if val is 1 then this will return similar of elements in the two arrays
  const elements = allFields.filter((x) => fieldsToUpdate.indexOf(x) === val);
  return elements;
}

function imageFilter(fileType) {
  // Accept images only
  if (fileType == "image/jpeg" || fileType == "image/png") {
    return true;
  }
  return false;
}

async function unlinkAFile(path) {
  fs.unlink(path, async (err) => {
    if (err) {
      await Utils.logToWinston("Unable to remove prev uploaded file", err);
      return false;
    } else return true;
  });
}
async function findAll(obj) {
  let params = {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  };

  if (obj.hasOwnProperty("fetchRowCond")) {
    params.where = obj.fetchRowCond;
  }

  const model = obj.model;
  try {
    const resSet = await model.findAll(params);
    return {
      success: true,
      message: "Success",
      resultSet: resSet,
    };
  } catch (e) {
    return {
      success: false,
      message: "Failed to fetch data",
      errorMs: e,
    };
  }
}

async function findOne(obj) {
  let params = {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  };

  if (obj.hasOwnProperty("includes")) {
    params.attributes.include = obj.includes;
  }

  if (obj.hasOwnProperty("excludes")) {
    params.attributes.exclude = [...params.attributes.exclude, ...obj.excludes];
  }

  if (obj.hasOwnProperty("fetchRowCond")) {
    params.where = obj.fetchRowCond;
  }

  if (obj.hasOwnProperty("order")) {
    params.order = [obj.order];
  }

  const model = obj.model;
  try {
    const resSet = await model.findOne(params);
    return {
      success: true,
      message: "Success",
      resultSet: resSet,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to fetch data",
      errorMs: error,
    };
  }
}

async function getCurrentDateTimeYMD() {
  var today = new Date();
  var now = today.toLocaleString();
  const dateSplit = now.split(",");

  const formatYmd = (date) => date.toISOString().slice(0, 10);
  return formatYmd(new Date()) + dateSplit[1];
}

async function sendMail(mailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      port: 465, // true for 465, false for other ports
      host: "smtp.gmail.com",
      auth: {
        user: "sudhaker.ssr@gmail.com",
        pass: "gihxxbhmlzcbtbdp",
      },
      secure: true,
    });
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log("failed to send email due toooo:", err);
        throw err;
      } else console.log(info);
    });
  } catch (err) {
    console.log("failed to send email due to:", err);
  }
}

const encryptData = (data) => {
  let text = data.toString();

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

async function updateData(model, data, cond) {
  /* cond should be like below
  
  const cond = {
      where: { email: reqObj.email },
    };
    */
  try {
    await model.update(data, cond);
    return {
      error: false,
      errorMessage: "",
    };
  } catch (err) {
    return {
      error: true,
      errorMessage: err,
    };
  }
}

function convertStringToUpperLowercase(str, textCase = "upper") {
  let convertedString = "";

  for (let i = 0; i < str.length; i++) {
    const char = str.charAt(i);

    if (/[a-zA-Z]/.test(char)) {
      convertedString += char.toUpperCase();
      if (textCase === "lower") {
        convertedString += char.toLowerCase();
      }
    } else {
      convertedString += char;
    }
  }

  return convertedString;
}

async function checkTurfAvailability(obj) {
  let dbObj = {
    host: "localhost",
    user: "root",
    password: "",
    database: "slotbooking",
  };
  if (process.env.NODE_ENV === "production") {
    dbObj = {
      host: "148.66.136.3",
      user: "pranay",
      password: "#lu4BkmNh3Zo",
      database: "pyroslotbooking",
    };
  }

  return new Promise((resolve, reject) => {
    // Create a Sequelize instance
    const sequelize = new Sequelize(
      "pyroslotbooking",
      "pranay",
      "#lu4BkmNh3Zo",
      {
        host: "148.66.136.3",
        dialect: "mysql", // Or any other supported dialect
      }
    );

    // Define your raw SQL query
    // const sqlQuery = "SELECT * FROM your_table WHERE your_condition = :yourValue";
    const sqlQuery = `
  SELECT COUNT(*) AS count
  FROM upcoming_bookings
  WHERE arena_id = :arena_id
  AND turf_id = :turf_id
  AND bookedDate = :bookedDate
  AND ((bookedAt BETWEEN :bookedAt AND :bookedTill) OR (bookedTill BETWEEN :bookedAt AND :bookedTill))`;

    // Replace with the actual values

    const values = {
      arena_id: obj.arena_id,
      turf_id: obj.turf_id,
      bookedAt: obj.bookedAt,
      bookedTill: obj.bookedTill,
      bookedDate: obj.bookedDate + " 00:00:00",
    };

    // Execute the raw SQL query
    sequelize
      .query(sqlQuery, {
        replacements: values, // Bind parameters
        type: Sequelize.QueryTypes.SELECT, // Query type: SELECT, INSERT, UPDATE, DELETE, etc.
      })
      .then((results) => {
        // `results` will contain the result of your query
        console.log("Query result is:", results);

        resolve(results[0].count > 0 ? false : true);
      })
      .catch((error) => {
        console.error("Error executing the query:", error);
        reject(error);
      });
  });
}

async function getbookingsInfo(obj) {
  let dbObj = {
    host: "localhost",
    user: "root",
    password: "",
    database: "slotbooking",
  };
  if (process.env.NODE_ENV === "production") {
    dbObj = {
      host: "148.66.136.3",
      user: "pranay",
      password: "#lu4BkmNh3Zo",
      database: "pyroslotbooking",
    };
  }

  return new Promise((resolve, reject) => {
    // Create a Sequelize instance
    const sequelize = new Sequelize(
      "pyroslotbooking",
      "pranay",
      "#lu4BkmNh3Zo",
      {
        host: "148.66.136.3",
        dialect: "mysql", // Or any other supported dialect
      }
    );
    

    let sqlQuery = `select c.captainId as cid, c.captain_contact as mobile, b.booked_on as bookedOn, b.bookingId as bookingId, b.booked_at as bookedAt, td.turf_name as turf,
     o.balance_amount as balanceAmount from captains as c join bookings as b on b.booked_by=c.captainId join turfdetails as td on b.turfid=td.turfId join orders as o on o.bookingid=b.bookingId where b.booked_on=:bookedDate 
     and b.arena_id=:arena_id and  o.status=:status `;

    // Replace with the actual values

    const values = {
      arena_id: obj.arena_id,
      bookedDate: obj.bookedDate + " 00:00:00",
      status:'1'
    };

    if (obj.hasOwnProperty("contact_number")) {
      values.captain_contact = obj.contact_number;
      sqlQuery += `and c.captain_contact=:captain_contact`;
    }

    // Execute the raw SQL query
    sequelize
      .query(sqlQuery, {
        replacements: values, // Bind parameters
        type: Sequelize.QueryTypes.SELECT, // Query type: SELECT, INSERT, UPDATE, DELETE, etc.
      })
      .then((results) => {
        // `results` will contain the result of your query
        console.log("Query result is:", results);

        resolve(results);
      })
      .catch((error) => {        
        console.error("Error executing the query:", error);
        reject([]);
      });
  });
}

async function getbookingOrderDetails(obj) {
  return new Promise((resolve, reject) => {
    // Create a Sequelize instance
    const sequelize = new Sequelize(
      "pyroslotbooking",
      "pranay",
      "#lu4BkmNh3Zo",
      {
        host: "148.66.136.3",
        dialect: "mysql", // Or any other supported dialect
      }
    );

    let sqlQuery = `SELECT b.bookingId as bookingId, o.orderId as orderId, b.booked_on as bookedOn, b.booked_at as bookedAt, b.total_hrs as hrs, o.turf_cost as turfCost, o.advanced_paid as advpaid, o.balance_amount as balAmount, o.coupon_amount as couponCost, c.captain_name, c.captain_contact, td.turf_name FROM bookings as b join orders as o on o.bookingid=b.bookingId join captains as c on c.captainId=b.booked_by join turfdetails as td on td.turfId=b.turfid where b.bookingId=:bookingId and b.arena_id=:arenaId`;

    // Replace with the actual values

    const values = {
      arenaId: obj.arena_id,
      bookingId: obj.bookingId
    }; 

    // Execute the raw SQL query
    sequelize
      .query(sqlQuery, {
        replacements: values, // Bind parameters
        type: Sequelize.QueryTypes.SELECT, // Query type: SELECT, INSERT, UPDATE, DELETE, etc.
      })
      .then((results) => {
        // `results` will contain the result of your query
        console.log("Query result is:", results);

        resolve(results);
      })
      .catch((error) => {
        console.error("Error executing the query:", error);
        reject([]);
      });
  });
}

module.exports = {
  getDateTime,
  returnResult,
  retrunResponse,
  encrypt,
  decrypt,
  setTokenParams,
  generateRandomString,
  checkACL,
  catchError,
  logToWinston,
  checkBaseUser,
  logErrorMsg,
  loglastExecuteQueryToWinston,
  getrolebasedPermissions,
  checkFeatureAccessability,
  checkOffSetLimit,
  getAField,
  checkRowExists,
  getTotalRows,
  fetchRows,
  bulkInsertUpdate,
  getMinYear,
  getTableColumns,
  getElementsInArrays,
  imageFilter,
  unlinkAFile,
  getRowByPk,
  findAll,
  findOne,
  getCurrentDateTimeYMD,
  sendMail,
  encryptData,
  updateData,
  convertStringToUpperLowercase,
  checkTurfAvailability,
  getbookingsInfo,
  getbookingOrderDetails,
};
