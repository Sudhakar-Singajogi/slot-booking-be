const express = require("express");
const router = express.Router();
const path = require("path");
const Utils = require(path.resolve("src//utils"));
const venueServ = require(path.resolve("src/modules/venue/Services"));
const { checkArenaExists } = require(path.resolve(
  "src/middlewares/arenaexists"
));

router.post("/details", checkArenaExists(), async (req, res, next) => {
  //   let resultSet = {
  //     message: "User Signin-up module",
  //     result: [],
  //     totalRows: 0,
  //   };

  const reqObj = req.body;
  var resultSet = await venueServ.getVenueDetails(reqObj);
  console.log("resultSet is:", resultSet);

  await Utils.retrunResponse(res, resultSet);
});

router.post("/exists", checkArenaExists(), async (req, res, next) => {
  let resultSet = {
    message: "User Signin-up module",
    result: [],
    totalRows: 0,
  };
  await Utils.retrunResponse(res, resultSet);
});

router.post("/email-exists", async (req, res, next) => {
  let resultSet = {
    message: "User Signin-up module",
    result: [],
    totalRows: 0,
  };

  resultSet = await venueServ.checkmanagerEmailExists(req.body);

  await Utils.retrunResponse(res, resultSet);
});

router.post("/create", async (req, res, next) => {
  let resultSet = {
    message: "Arena Signin-up",
    result: [],
    totalRows: 0,
  };

  resultSet = await venueServ.registerArena(req.body);

  await Utils.retrunResponse(res, resultSet);
});

router.post("/login", async (req, res, next) => {
  let resultSet = {
    message: "Arena Sign in",
    result: [],
    totalRows: 0,
  };

  resultSet = await venueServ.doLogin(req.body);

  await Utils.retrunResponse(res, resultSet);
});

module.exports = router;
