const express = require("express");
const router = express.Router();
const path = require("path");
const Utils = require(path.resolve("src//utils"));

const turfServ = require(path.resolve("src/modules/turf/Services"));

router.post("/byareana", async (req, res) => {
    //   let resultSet = {
    //     message:"User Signin-up module",
    //     result:[],
    //     totalRows:0
    // };

  const reqObj = req.body;
  var resultSet = await turfServ.getTurfsByAreana(reqObj);
  console.log('resultSet is:', resultSet); 

  await Utils.retrunResponse(res, resultSet);
});

router.post("/sports", async (req, res) => { 

const reqObj = req.body;
var resultSet = await turfServ.getSportssByTurf(reqObj);
console.log('resultSet is:', resultSet); 

await Utils.retrunResponse(res, resultSet);
});

router.post("/details/:id", async (req, res) => {
  let resultSet = {
    message: "User Signin-up module",
    result: [],
    totalRows: 0,
  };

  await Utils.retrunResponse(res, resultSet);
});
module.exports = router;
