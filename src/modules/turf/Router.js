const express = require("express");
const router = express.Router();
const path = require("path");
const Utils = require(path.resolve("src//utils"));
const turfServ = require(path.resolve("src/modules/turf/Services"));
const { checkArenaExists } = require(path.resolve(
  "src/middlewares/arenaexists"
));

// router.post("/byareana", checkArenaExists(), async (req, res, next) => {
  router.post("/byareana", async (req, res, next) => {
  //   let resultSet = {
  //     message:"User Signin-up module",
  //     result:[],
  //     totalRows:0
  // };

  const reqObj = req.body;
  console.log('turfobject is:', reqObj)
  var resultSet = await turfServ.getTurfsByAreana(reqObj);
  console.log("resultSet is:", resultSet);

  await Utils.retrunResponse(res, resultSet);
});

// router.post("/sports", checkArenaExists(), async (req, res, next) => {
  router.post("/sports",  async (req, res, next) => {
  const reqObj = req.body;
  var resultSet = await turfServ.getSportssByTurf(reqObj);
  console.log("resultSet is:", resultSet);

  await Utils.retrunResponse(res, resultSet);
});

// router.post("/exists", checkArenaExists(), async (req, res, next) => {
  router.post("/exists", async (req, res, next) => {
  const reqObj = req.body;
  var resultSet = await turfServ.checkTurfExists(reqObj);
  console.log("resultSet is:", resultSet);

  await Utils.retrunResponse(res, resultSet);
});

// router.post("/getdetails", checkArenaExists(), async (req, res, next) => {
  router.post("/getdetails", async (req, res, next) => {
  const reqObj = req.body;
  var resultSet = await turfServ.getATurf(reqObj);
  console.log("resultSet is:", resultSet);
  await Utils.retrunResponse(res, resultSet);
});

// router.post("/update", checkArenaExists(), async (req, res, next) => { 
  router.post("/update",  async (req, res, next) => { 
  var resultSet = await turfServ.updateATurf(req);
  console.log("resultSet is:", resultSet);
  await Utils.retrunResponse(res, resultSet);
});

// router.post("/create", checkArenaExists(), async (req, res, next) => {
  router.post("/create", async (req, res, next) => {
  const reqObj = req.body;
  var resultSet = await turfServ.createATurf(reqObj);
  console.log("resultSet is:", resultSet);
  await Utils.retrunResponse(res, resultSet);
})

// router.post("/delete", checkArenaExists(), async (req, res, next) =>{
  router.post("/delete", async (req, res, next) =>{
  const reqObj = req.body;
  var resultSet = await turfServ.deleteATurf(reqObj);
  console.log("resultSet is:", resultSet);
  await Utils.retrunResponse(res, resultSet);
})

// router.post("/addsports", checkArenaExists(), async (req, res, next) =>{ 
  router.post("/addsports", async (req, res, next) =>{ 
  const reqObj = req.body;
  var resultSet = await turfServ.addSportsToTurf(reqObj);
  console.log("resultSet is:", resultSet);
  await Utils.retrunResponse(res, resultSet);
})

module.exports = router;
