const express = require("express");
const Sequelize = require("sequelize");
const path = require("path");
const Utils = require(path.resolve("src//utils"));
const op = Sequelize.Op;

let turfModel = require(path.resolve("src/modules/turf/Turf"));
let venueModel = require(path.resolve("src/modules/venue/Venue"));

turfModel.belongsTo(venueModel, {
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
        turfModel,
        turfModel,
        "Get total turfs of a venue",
      );
      const excludeFields = ["status", "createdAt", "updatedAt"];

      const includes = [];
      const orderBy = ["turfid", "DESC"];
      const msg = "Get turfs of a venue ";
      const fetchObjParams = {
        model: turfModel,
        fetchRowsCond: condition,
        offSe:0,
        limit:100,
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
};
