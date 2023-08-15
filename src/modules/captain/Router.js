const express = require("express");
const router = express.Router();
const path = require("path");
const Utils = require(path.resolve("src//utils"));
const captainServ = require(path.resolve("src/modules/captain/Services"));
const {checkArenaExists} = require(path.resolve("src/middlewares/arenaexists"));

router.post("/details",async (req, res, next) => {
//   let resultSet = {
//     message: "User Signin-up module",
//     result: [],
//     totalRows: 0,
//   };

const reqObj = req.body;
var resultSet = await captainServ.getDetails(reqObj);
console.log('resultSet is:', resultSet);  

  await Utils.retrunResponse(res, resultSet);
}); 

router.post("/create",async (req, res, next) => { 
  
  const reqObj = req.body;
  var resultSet = await captainServ.create(reqObj);
  console.log('resultSet is:', resultSet);  
  
    await Utils.retrunResponse(res, resultSet);
  }); 

module.exports = router;
