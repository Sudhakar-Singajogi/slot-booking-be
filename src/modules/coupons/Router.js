const express = require("express");
const router = express.Router();
const path = require("path");
const Utils = require(path.resolve("src//utils"));
const couponServ = require(path.resolve("src/modules/coupons/Services"));
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
  var resultSet = await couponServ.getTCouponsByAreana(reqObj);
  console.log("resultSet is:", resultSet);

  await Utils.retrunResponse(res, resultSet);
});

// router.post("/getcoupon", checkArenaExists(), async (req, res, next) => {
  router.post("/getcoupon", async (req, res, next) => {
  const reqObj = req.body;
  var resultSet = await couponServ.getACoupon(reqObj);
  console.log("resultSet is:", resultSet);

  await Utils.retrunResponse(res, resultSet);
});

// router.post("/addcoupon", checkArenaExists(), async (req, res, next) => {
  router.post("/addcoupon", async (req, res, next) => {
  const reqObj = req.body;
  var resultSet = await couponServ.createACoupon(reqObj);
  console.log("resultSet is:", resultSet);

  await Utils.retrunResponse(res, resultSet);
});

module.exports = router;
