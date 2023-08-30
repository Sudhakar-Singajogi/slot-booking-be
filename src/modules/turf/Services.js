const express = require("express");
const Sequelize = require("sequelize");
const path = require("path");
const Utils = require(path.resolve("src//utils"));
const op = Sequelize.Op;

let turfModel = require(path.resolve("src/modules/turf/Turf"));
let venueModel = require(path.resolve("src/modules/venue/Venue"));
let sportModel = require(path.resolve("src/modules/turf/SportsByTurf"));

turfModel.belongsTo(venueModel, {
  through: "arena_id",
  foreignKey: "arena_id",
});

sportModel.belongsTo(turfModel, {
  through: "turfid",
  foreignKey: "turfid",
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
  getTurfsByAreana: async (reqBody) => {
    var errors = [];
    // const isAreanaExists = await venueModel.findOne({
    //   where: {
    //     arena_id: req.params.arena_id,
    //   },
    // })

    try {
      const condition = { arena_id: reqBody.arena_id };
      const isAreanaExists = await Utils.checkRowExists(
        condition,
        venueModel,
        "check whether areana exists"
      );

      if (isAreanaExists === 0) {
        errors.push({
          sectionName: `Invalid venue provided`,
        });
      }

      if (errors.length > 0) {
        return await Utils.returnResult("Areana existance", {
          ValidationErrors: errors,
        });
      }

      const totalResults = await Utils.getTotalRows(
        condition,
        turfModel,
        "Get total turfs of a venue"
      );
      const excludeFields = ["status", "createdAt", "updatedAt"];

      const includes = [];
      const orderBy = ["turfid", "DESC"];
      const msg = "Get turfs of a venue ";
      const fetchObjParams = {
        model: turfModel,
        fetchRowsCond: condition,
        offSe: 0,
        limit: 100,
        msg,
        excludeFields,
        includes,
        orderBy,
      };

      const turfs = await Utils.fetchRows(fetchObjParams);
      if (turfs) {
        //get the total
        return await Utils.returnResult(
          "turfs",
          turfs.resultSet,
          null,
          totalResults
        );
      } else {
        return await Utils.returnResult("turfs", false, "No turf found");
      }
    } catch (err) {
      console.log("syntax:", err);
      return await Utils.catchError("section creation", err);
    }
  },
  getSportssByTurf: async (reqBody) => {
    var errors = [];

    try {
      const condition = { turfid: reqBody.turfid, arena_id: reqBody.arena_id };
      console.log("condition is:", condition);
      const isTurfExists = await Utils.checkRowExists(
        condition,
        turfModel,
        "check whether turf exists"
      );

      if (isTurfExists === 0) {
        errors.push({
          turf: `Invalid turf info provided`,
        });
      }

      if (errors.length > 0) {
        return await Utils.returnResult("Turf existance", {
          ValidationErrors: errors,
        });
      }

      const totalResults = await Utils.getTotalRows(
        { turfid: reqBody.turfid },
        sportModel,
        "Get total sports can play on a turf"
      );
      const excludeFields = ["turfid", "createdAt", "updatedAt"];

      const includes = [];
      const orderBy = ["sportsbyturfId", "DESC"];
      const msg = "Get total sports can play on a turf";
      const fetchObjParams = {
        model: sportModel,
        fetchRowsCond: { turfid: reqBody.turfid },
        offSe: 0,
        limit: 100,
        msg,
        excludeFields,
        includes,
        orderBy,
      };

      const sports = await Utils.fetchRows(fetchObjParams);
      if (sports) {
        //get the total
        return await Utils.returnResult(
          "sports",
          sports.resultSet,
          null,
          totalResults
        );
      } else {
        return await Utils.returnResult("sports", false, "No sport found");
      }
    } catch (err) {
      console.log("syntax:", err);
      return await Utils.catchError("Fetching sports by turf", err);
    }
  },
  checkTurfExists: async (reqBody) => {
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
  getATurf: async (reqBody) => {
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
  updateATurf: async (reqBody) => {
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
  createATurf: async (reqBody) => {
    try {
      const turf = await turfModel.create(reqBody);
      return await Utils.returnResult("turf", turf, null, 1);
    } catch (error) {
      console.error(error);
      // res.status(500).send("Error in creating new turf");
      return await Utils.returnResult("turf", [], "Error in creating new turf");
    }
  },
  deleteATurf: async (reqBody) => {
    const condition = { turfid: reqBody.turfId, arena_id: reqBody.arena_id };
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
    if (turf.resultSet) {
      return await turfModel
        .destroy({
          where: condition,
        })
        .then(async () => {
          await sportModel.destroy({
            where: { turfid: reqBody.turfId},
          });
          return await Utils.returnResult("turf", turf, null, 1);
        })
        .catch(async (err) => {
          await Utils.logToWinston(
            "Failed in unassigning of the permissions due to:",
            err
          );
        });
    } else {
      return await Utils.returnResult("turf", [], "No record found");
    }
  },
  addSportsToTurf: async (reqBody) => {
    const turfid = reqBody.sports[0].turfid;
    const condition = { turfid: turfid };
    // return false;
    return await sportModel
      .destroy({
        where: condition,
      })
      .then(async () => {
        // return await Utils.returnResult("sportbyturf", turf, null, 1);
        const paramObj = {
          model: sportModel,
          data: reqBody.sports,
          insertUpdate: "insert",
          updateOnDuplicateFields: [],
          fetchRowsCond: condition,
          offset: 0,
          limit: 100,
          msg: "Add sports to turf",
          excludeFields: ["createdAt", "updatedAt"],
          feature: "AddSportstoTurf",
          includes: [],
          orderBy: [],
        };

        // bulk update the sections
        const resp = await Utils.bulkInsertUpdate(paramObj);
        console.log("sports are:", resp);

        return await Utils.returnResult(
          "Added sports to turf",
          resp,
          null,
          resp.resultSet.length
        );
      })
      .catch(async (err) => {
        await Utils.logToWinston("Failed to add sports to turf:", err);
      });
  },
};
