const Sequelize = require("sequelize");
const path = require("path");
const sequelize = require(path.resolve("src/dbconn/", "connection"));
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
  fetchSlotsBooked: async (reqBody) => {
    const query = `
    SELECT  turf_id as turf, TIME(booked_at) as start, TIME(booked_till) as end
    FROM upcoming_bookings
    WHERE arena_id = ?
    AND  DATE(bookedDate) = ?
    ${reqBody.hasOwnProperty("turf_id") ? "AND turf_id = ?" : ""}
    `; 

    const replacements = [
      reqBody.arena_id,
      reqBody.bookedDate,
    ];

    if(reqBody.hasOwnProperty("turf_id")) {
      replacements.push(reqBody.turf_id);
    }

    const results = await sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
      replacements,
    });

    let obj = {
      resultSet: {
        totalRows: results.length,
        data: results,
      },
    };
    return await Utils.returnResult("booked slots", obj, null, results.length);
    
  },
  fetchBookingsInfo: async (reqBody) => {
    const bookinsInfo = await Utils.getbookingsInfo(reqBody);
    if(bookinsInfo.length > 0) {
      let obj = bookinsInfo;
      return await Utils.returnResult("booked slots", obj, null, bookinsInfo.length);
    }
    return await Utils.returnResult("bookinsInfo", false, null, 0);
    console.log("bookinsInfo: ", bookinsInfo);

  },

  fetchBookingsOrderDetails: async (reqBody) => {
    const bookinsInfo = await Utils.getbookingOrderDetails(reqBody);
    if(bookinsInfo.length > 0) {
      let obj = bookinsInfo;
      return await Utils.returnResult("booked slots", obj, null, bookinsInfo.length);
    }
    return await Utils.returnResult("bookinsInfo", false, null, 0);
    console.log("bookinsInfo: ", bookinsInfo);

  },

  
};
