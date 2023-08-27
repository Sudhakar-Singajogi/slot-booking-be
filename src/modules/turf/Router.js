const express = require("express");
const router = express.Router();
const path = require("path");
const Utils = require(path.resolve("src//utils"));
const turfServ = require(path.resolve("src/modules/turf/Services"));
const { checkArenaExists } = require(path.resolve(
  "src/middlewares/arenaexists"
));

router.post("/byareana", checkArenaExists(), async (req, res, next) => {
  //   let resultSet = {
  //     message:"User Signin-up module",
  //     result:[],
  //     totalRows:0
  // };

  const reqObj = req.body;
  var resultSet = await turfServ.getTurfsByAreana(reqObj);
  console.log("resultSet is:", resultSet);

  await Utils.retrunResponse(res, resultSet);
});

router.post("/sports", checkArenaExists(), async (req, res, next) => {
  const reqObj = req.body;
  var resultSet = await turfServ.getSportssByTurf(reqObj);
  console.log("resultSet is:", resultSet);

  await Utils.retrunResponse(res, resultSet);
});

router.post("/exists", checkArenaExists(), async (req, res, next) => {
  const reqObj = req.body;
  var resultSet = await turfServ.checkTurfExists(reqObj);
  console.log("resultSet is:", resultSet);

  await Utils.retrunResponse(res, resultSet);
});

router.post("/getdetails", checkArenaExists(), async (req, res, next) => {
  const reqObj = req.body;
  var resultSet = await turfServ.getATurf(reqObj);
  console.log("resultSet is:", resultSet);
  await Utils.retrunResponse(res, resultSet);
});

module.exports = router;
