const Sequelize = require("sequelize");
const path = require("path");
const Utils = require(path.resolve("src//utils"));
const op = Sequelize.Op;
let venueModel = require(path.resolve("src/modules/venue/Venue"));

// exclude: [
//   "venueId",
//   "arena_manager",
//   "manager_contact1",
//   "manager_contact2",
//   "createdAt",
//   "updatedAt",
// ],

module.exports = {
  getVenueDetails: async (reqBody) => {
    var errors = [];
    const totalResults = 1;

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

      const excludeFields = ["manager_contact1", "manager_contact2", "status", "createdAt", "updatedAt"];

      const includes = [];
      const orderBy = ["venueId", "DESC"];
      const msg = "Get a venue ";
      const fetchObjParams = {
        model: venueModel,
        fetchRowsCond: condition,
        offSe: 0,
        limit: 100,
        msg,
        excludeFields,
        includes,
        orderBy,
      };

      const venue = await Utils.fetchRows(fetchObjParams);
      if (venue) {
        //get the total
        return await Utils.returnResult(
          "venue",
          venue.resultSet,
          null,
          totalResults
        );
      } else {
        return await Utils.returnResult("Venue", false, "No turf found");
      }
    } catch (err) {
      console.log("syntax:", err);
      return await Utils.catchError("Get Venue details by areana id", err);
    }
  },
  
};
