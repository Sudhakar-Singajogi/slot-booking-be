const Sequelize = require("sequelize");
const path = require("path");
const Utils = require(path.resolve("src//utils"));
const op = Sequelize.Op;
let venueModel = require(path.resolve("src/modules/venue/Venue"));
const md5 = require("md5");

const { v4: uuidv4 } = require("uuid");
async function generateUniqueVenueUID() {
  let uniqueUID = uuidv4(); // Generate a UUID

  // Check if the generated UUID already exists in the table
  const existingVenue = await venueModel.findOne({
    where: { arena_id: uniqueUID },
  });

  // If UUID exists, generate a new one recursively
  if (existingVenue) {
    return generateUniqueVenueUID();
  }

  return uniqueUID;
}

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

      const excludeFields = [
        "manager_contact1",
        "manager_contact2",
        "status",
        "createdAt",
        "updatedAt",
      ];

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
  checkmanagerEmailExists: async (reqBody) => {
    var errors = [];
    const totalResults = 1;

    try {
      const condition = { manager_email: reqBody.email };
      const isEmailExists = await Utils.checkRowExists(
        condition,
        venueModel,
        "check whether manager email exists"
      );

      console.log("isEmailExists: ", isEmailExists);

      let obj = {
        resultSet: {
          totalRows: 1,
          data: ["exists"],
        },
        ValidationErrors: "",
      };

      if (isEmailExists > 0) {
        const res = await Utils.findOne({
          model: venueModel,
          fetchRowCond: condition,
        });
        return await Utils.returnResult("arena email", res, null, 1);
      }

      return await Utils.returnResult("arena", false, "Email does not exists");
    } catch (err) {
      console.log("syntax:", err);
      return await Utils.catchError("Get Venue details by emailn id", err);
    }
  },
  registerArena: async (reqBody) => {
    const body = reqBody;

    const arena_id = await generateUniqueVenueUID(); // Generate a UUID
    const arenaObj = {
      arena_id: arena_id,
      arena_name: body.arena_name,
      arena_location: body.arena_location,
      manager_email: body.email,
      arena_manager: body.manager_name,
      password: md5(body.password),
    };

    console.log("arenaObj: ", arenaObj);

    try {
      const createdArena = await venueModel.create(arenaObj);

      const res = await Utils.findOne({
        model: venueModel,
        fetchRowCond: { venueId: createdArena.venueId },
      });
      return await Utils.returnResult("arena email", res, null, 1);

      await Utils.returnResult("New areana creation", createdArena);
    } catch (error) {
      console.log("error in creating an arena is:", error);
      let obj = {
        resultSet: {
          totalRows: 0,
          data: [],
        },
        ValidationErrors: error,
      };
      return await Utils.returnResult(
        "arena",
        obj,
        "Failed to create arena",
        0
      );
    }
  },
  doLogin: async (reqBody) => {
    const totalResults = 1;

    try {
      const pwd = md5(reqBody.password);

      const condition = { manager_email: reqBody.email, password: pwd };

      const isManagerExists = await Utils.checkRowExists(
        condition,
        venueModel,
        "check whether manager email exists"
      );

      console.log("isManagerExists: ", isManagerExists);

      let obj = {
        resultSet: {
          totalRows: totalResults,
          data: ["exists"],
        },
        ValidationErrors: "",
      };

      if (isManagerExists > 0) {
        const res = await Utils.findOne({
          model: venueModel,
          fetchRowCond: condition,
        });
        return await Utils.returnResult("Areana Manager", res, null, 1);
      }

      return await Utils.returnResult(
        "arena",
        false,
        "Please check your credentials"
      );
    } catch (err) {
      console.log("syntax:", err);
      return await Utils.catchError("Do a login", err);
    }
  },
};
