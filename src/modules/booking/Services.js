const Sequelize = require("sequelize");
const path = require("path");
const Utils = require(path.resolve("src//utils"));
const op = Sequelize.Op;
let bookingModel = require(path.resolve("src/modules/booking/Booking"));

// exclude: [
//   "venueId",
//   "arena_manager",
//   "manager_contact1",
//   "manager_contact2",
//   "createdAt",
//   "updatedAt",
// ],

module.exports = {
  create: async (reqBody) => {
    // delete reqBody.booking_cost;

    // const createdBooking = await bookingModel.create(reqBody);

    // console.log("createdBooking:", createdBooking.bookingId);

    // const resp = Utils.findOne();

    // if (resp) {
    //   return await Utils.returnResult(
    //     "Create new booking",
    //     resp.resultSet,
    //     null,
    //     resp.resultSet.length
    //   );
    // } else {
    //   await Utils.returnResult("Create and Assign Permissions", [], false);
    // }
  },
};
