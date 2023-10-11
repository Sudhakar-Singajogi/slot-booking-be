const Sequelize = require("sequelize");
const path = require("path");
const Utils = require(path.resolve("src//utils"));
const op = Sequelize.Op;
let captainModel = require(path.resolve("src/modules/captain/Captain"));

// exclude: [
//   "venueId",
//   "arena_manager",
//   "manager_contact1",
//   "manager_contact2",
//   "createdAt",
//   "updatedAt",
// ],

module.exports = {
  getDetails: async (reqBody) => {
    var errors = [];
    const totalResults = 1;

    try {
    const captain_contact = reqBody.captain_contact.length > 10 ? reqBody.captain_contact.slice(2) : reqBody.captain_contact;
      const condition = { captain_contact: captain_contact }; 
      
      const fetchObjParams = {
        model: captainModel,
        fetchRowCond: condition,
      };

      const captain = await Utils.findOne(fetchObjParams);
      if (captain) {
        //get the total
        return await Utils.returnResult(
          "captain",
          captain.resultSet,
          null,
          totalResults
        );
      } else {
        return await Utils.returnResult("captain", false, "No user found");
      }
    } catch (err) {
      console.log("syntax:", err);
      return await Utils.catchError("Get captain by contact number", err);
    }
  },
  create: async(reqBody) => {

    try {

    } catch(err) {
      
    }
    reqBody = {
        ...reqBody,
        captain_contact:  reqBody.captain_contact.length > 10 ? reqBody.captain_contact.slice(2) : reqBody.captain_contact,        
    };
    
    let insertCaptain = [reqBody];

    const paramObj = {
        model: captainModel,
        data: insertCaptain,
        insertUpdate: "insert",
        updateOnDuplicateFields: [],
        fetchRowsCond: { captain_contact:reqBody.captain_contact },
        offset: 0,
        limit: 100,
        msg: "Create a new captain",
        excludeFields: ["createdAt", "updatedAt"],
        feature: "CreateCaptain",
        includes: [],
        orderBy: ["captainId", "desc"],
      };

      const resp = await Utils.bulkInsertUpdate(paramObj);
      if (resp) {

        console.log("response is: ", resp)

        if(resp.resultSet.hasOwnProperty('FailedToCreate')) {
          return await Utils.returnResult(
            "Create new captain",
            {"DBErrors" : "Failed to create captain"},
            "Failed to create captain",
            0
          ); 

        } else {
          return await Utils.returnResult(
            "Create new captain",
            resp.resultSet,
            null,
            resp.resultSet.length
          ); 

        }
      } else {
        await Utils.returnResult("Create Captain", [], false);
      }

  }
  
};
