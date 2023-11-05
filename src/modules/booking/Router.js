const express = require("express");
const router = express.Router();
const path = require("path");
const Utils = require(path.resolve("src//utils"));
const bookingServ = require(path.resolve("src/modules/booking/Services"));
const { checkArenaExists } = require(path.resolve(
  "src/middlewares/arenaexists"
));


router.post("/get-booked-slots", async (req, res, next) => {
  //   let resultSet = {
  //     message: "User Signin-up module",
  //     result: [],
  //     totalRows: 0,
  //   };

  const reqObj = req.body;
  var resultSet = await bookingServ.fetchSlotsBooked(reqObj);
  console.log("resultSet is:", resultSet);

  await Utils.retrunResponse(res, resultSet);
});

router.post("/get-bookings-info", async (req, res, next) => {
  const reqObj = req.body;
  var resultSet = await bookingServ.fetchBookingsInfo(reqObj);

  console.log("resultSet is:", resultSet);

  await Utils.retrunResponse(res, resultSet);
});

router.post("/get-bookings-order-details", async (req, res, next) => {
  const reqObj = req.body;
  var resultSet = await bookingServ.fetchBookingsOrderDetails(reqObj);

  console.log("resultSet is:", resultSet);

  await Utils.retrunResponse(res, resultSet);
});
 
// router.post("/pay-balance-amount", checkArenaExists(), async(req, res, next) => {
  router.post("/pay-balance-amount", async(req, res, next) => {
  const reqObj = req.body;
  var resultSet = await bookingServ.payBalanceAmount(reqObj);
  await Utils.retrunResponse(res, resultSet);
})

// router.post("/cancel-booking-order", checkArenaExists(), async(req, res, next) => {
  router.post("/cancel-booking-order",  async(req, res, next) => {
  const reqObj = req.body;
  var resultSet = await bookingServ.cancelBookingOrder(reqObj);
  await Utils.retrunResponse(res, resultSet);
})

module.exports = router;
