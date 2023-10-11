const express = require("express");
const Sequelize = require("sequelize");
const path = require("path");
const Utils = require(path.resolve("src//utils"));
const op = Sequelize.Op;

let couponModel = require(path.resolve("src/modules/coupons/Coupon"));
let venueModel = require(path.resolve("src/modules/venue/Venue"));

couponModel.belongsTo(venueModel, {
  through: "arena_id",
  foreignKey: "arena_id",
});

const venueAssoc = {
  model: venueModel,
  attributes: {
    exclude: [
      "venueId",
      "arena_manager",
      "manager_contact1",
      "manager_contact2",
      "createdAt",
      "updatedAt",
    ],
  },
};

module.exports = {
  getTCouponsByAreana: async (reqBody) => {
    try {
      const condition = { arena_id: reqBody.arena_id };

      const totalResults = await Utils.getTotalRows(
        condition,
        couponModel,
        "Get total coupons of a venue"
      );
      const excludeFields = ["createdAt", "updatedAt"];

      const includes = [];
      const orderBy = ["couponId", "DESC"];
      const msg = "Get coupons of a venue ";
      const fetchObjParams = {
        model: couponModel,
        fetchRowsCond: condition,
        offSe: 0,
        limit: 100,
        msg,
        excludeFields,
        includes,
        orderBy,
      };

      const coupons = await Utils.fetchRows(fetchObjParams);
      if (coupons) {
        //get the total
        return await Utils.returnResult(
          "coupons",
          coupons.resultSet,
          null,
          totalResults
        );
      } else {
        return await Utils.returnResult("coupons", false, "No coupons found");
      }
    } catch (err) {
      console.log("syntax:", err);
      return await Utils.catchError("coupons fetching failed", err);
    }
  },

  getACoupon: async (reqBody) => {
    var errors = [];

    try {
      const condition = { couponId: reqBody.coupon_id, arena_id:reqBody.arena_id };
      const excludeFields = ["arena_id", "status", "createdAt", "updatedAt"];

      const includes = [];
      const msg = "Get A Coupon info";
      const fetchObjParams = {
        model: couponModel,
        fetchRowCond: condition,
        msg,
        excludeFields,
        includes,
      };
      
      const coupon = await Utils.findOne(fetchObjParams);
      console.log("coupon:", coupon);
      return coupon.resultSet
      ? await Utils.returnResult("coupon", coupon, null, 1)
      : await Utils.returnResult("coupon", coupon, "No record found");
    } catch (err) {
      console.log("syntax:", err);
      return await Utils.catchError("Fetching a coupon", err);
    }
  },
  createACoupon: async (reqBody) => {
    try {
      const coupon = await couponModel.create(reqBody);
      return await Utils.returnResult("coupon", coupon, null, 1);
    } catch (error) {
      console.error(error);
      // res.status(500).send("Error in creating new coupon");
      return await Utils.returnResult("coupon", [], "Error in creating new coupon");
    }
  },
  
  /*
  checkCouponExists: async (reqBody) => {
    try {
      reqBody = {
        ...reqBody,
        bookedAt: reqBody.bookedAt - 1000,
        bookedTill: reqBody.bookedTill - 1000,
      };
      const isAvailable = await Utils.checkTurfAvailability(reqBody);
      let obj = {
        resultSet: {
          totalRows: 0,
          data: [],
        },
        ValidationErrors: "turf is not available at this time",
      };
      return !isAvailable
        ? await Utils.returnResult("turf", obj, null, 0)
        : await Utils.returnResult("sports", false, "Is available");
    } catch (error) {
      console.log(error);
      return await Utils.catchError("Fetching turf existence failed", error);
    }
  },
  getACoupon: async (reqBody) => {
    var errors = [];

    try {
      const condition = { turfid: reqBody.turfId };
      const excludeFields = ["arena_id", "status", "createdAt", "updatedAt"];

      const includes = [];
      const msg = "Get A turf info for a turf";
      const fetchObjParams = {
        model: turfModel,
        fetchRowCond: condition,
        msg,
        excludeFields,
        includes,
      };

      const turf = await Utils.findOne(fetchObjParams);
      console.log("turf:", turf);
      return turf.resultSet
        ? await Utils.returnResult("turf", turf, null, 1)
        : await Utils.returnResult("turf", turf, "No record found");
    } catch (err) {
      console.log("syntax:", err);
      return await Utils.catchError("Fetching sports by turf", err);
    }
  },
  updateACoupon: async (reqBody) => {
    const condition = {
      turfId: reqBody.body.turfId,
      arena_id: reqBody.body.arena_id,
    };
    const turfData = reqBody.body;

    delete reqBody.body.arena_id;
    delete reqBody.body.turfId;

    const turfUpdate = await Utils.updateData(turfModel, reqBody.body, {
      where: condition,
    });

    console.log("turfUpdate: ", turfUpdate);
    if (!turfUpdate.error) {
      const excludeFields = ["arena_id", "status", "createdAt", "updatedAt"];

      const includes = [];
      const msg = "Get A turf info for a turf";
      const fetchObjParams = {
        model: turfModel,
        fetchRowCond: condition,
        msg,
        excludeFields,
        includes,
      };

      const turf = await Utils.findOne(fetchObjParams);
      console.log("turf:", turf);
      return turf.resultSet
        ? await Utils.returnResult("turf", turf, null, 1)
        : await Utils.returnResult("turf", turf, "No record found");
    }
  },
*/
};
