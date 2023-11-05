const Sequelize = require("sequelize");
const path = require("path");
const sequelize = require(path.resolve("src/dbconn/", "connection"));
const Utils = require(path.resolve("src//utils"));
const op = Sequelize.Op;
let bookingModel = require(path.resolve("src/modules/booking/Booking"));
let venueModel = require(path.resolve("src/modules/venue/Venue"));
let orderModel = require(path.resolve("src/modules/order/Order"));

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

    const replacements = [reqBody.arena_id, reqBody.bookedDate];

    if (reqBody.hasOwnProperty("turf_id")) {
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
    if (bookinsInfo.length > 0) {
      let obj = bookinsInfo;
      return await Utils.returnResult(
        "booked slots",
        obj,
        null,
        bookinsInfo.length
      );
    }
    return await Utils.returnResult("bookinsInfo", false, null, 0);
    console.log("bookinsInfo: ", bookinsInfo);
  },

  fetchBookingsOrderDetails: async (reqBody) => {
    const bookinsInfo = await Utils.getbookingOrderDetails(reqBody);
    if (bookinsInfo.length > 0) {
      let obj = bookinsInfo;
      return await Utils.returnResult(
        "booked slots",
        obj,
        null,
        bookinsInfo.length
      );
    }
    return await Utils.returnResult("bookinsInfo", false, null, 0);
    console.log("bookinsInfo: ", bookinsInfo);
  },

  payBalanceAmount: async (reqBody) => {
    const bookingId = reqBody.bookingId;
    const orderId = reqBody.orderId;
    const paidAmount = reqBody.paidAmount;
    const arena_id = reqBody.arena_id;
    const balance_amount_paid_via = reqBody.balance_amount_paid_via
    let errors = [];

    //check whether the order and bookingId exists

    let condition = {};
    condition = { bookingId: bookingId };
    console.log("condition:", condition);
    const isBookingExists = await Utils.checkRowExists(
      condition,
      bookingModel,
      "check whether booking exists"
    );

    if (isBookingExists === 0) {
      errors.push({
        Booking: `Invalid Booking provided`,
      });
    } else {
      condition = {};
      condition = { orderId: orderId };
      console.log("condition:", condition);
      const isBookingExists = await Utils.checkRowExists(
        condition,
        orderModel,
        "check whether order exists"
      );

      if (isBookingExists === 0) {
        errors.push({
          Order: `Invalid Order provided`,
        });
      } else {
        try {

          await Utils.updateData(
            bookingModel,
            {
              status: "3",
              updatedAt: Utils.getDateTime,
            },
            {
              where: { bookingId: bookingId },
            }
          );
          
          
          const orderUpdate = await Utils.updateData(
            orderModel,
            {
              balance_amount_paid: paidAmount,
              status: "3",
              balance_amount_paid_via:balance_amount_paid_via,
              updatedAt: Utils.getDateTime,
            },
            {
              where: { orderId: orderId },
            }
          );

          if (orderUpdate.error) {
            errors.push({
              order: `Failed to update the order balance amount`,
            });
            return await Utils.returnResult("Failed to update the order", {
              ValidationErrors: errors,
            });
          }

          const excludeFields = ["status", "createdAt", "updatedAt"];

          const includes = [];
          const msg = "Get Updated Order";
          const fetchObjParams = {
            model: orderModel,
            fetchRowCond: { orderId: orderId },
            msg,
            excludeFields,
            includes,
          };

          const order = await Utils.findOne(fetchObjParams);
          return order.resultSet
            ? await Utils.returnResult("order", order, null, 1)
            : await Utils.returnResult("order", order, "No order found");
        } catch (error) {
          console.log("error is: ", error);

          await Utils.returnResult("order", false, "No record found");
        }
      }
    }

    if (errors.length > 0) {
      return await Utils.returnResult("Areana/booking existance", {
        ValidationErrors: errors,
      });
    }
  },

  cancelBookingOrder: async (reqBody) => {
    const bookingId = reqBody.bookingId;
    const orderId = reqBody.orderId;
    const paidAmount = reqBody.paidAmount;
    let errors = [];

    //check whether the order and bookingId exists
    let condition = {};
    condition = { bookingId: bookingId };
    console.log("condition:", condition);
    const isBookingExists = await Utils.checkRowExists(
      condition,
      bookingModel,
      "check whether booking exists"
    );

    if (isBookingExists === 0) {
      errors.push({
        Booking: `Invalid Booking provided`,
      });
    } else {
      condition = {};
      condition = { orderId: orderId };
      console.log("condition:", condition);
      const isBookingExists = await Utils.checkRowExists(
        condition,
        orderModel,
        "check whether order exists"
      );

      if (isBookingExists === 0) {
        errors.push({
          Order: `Invalid Order provided`,
        });
      } else {
        try {
          const bookingUpdate = await Utils.updateData(
            bookingModel,
            { status: "2", updatedAt: Utils.getDateTime },
            {
              where: { bookingId: bookingId },
            }
          );

          const orderUpdate = await Utils.updateData(
            orderModel,
            { status: "2", updatedAt: Utils.getDateTime },
            {
              where: { refund_amount: paidAmount, orderId: orderId },
            }
          );

          if (bookingUpdate.error || orderUpdate.error) {
            errors.push({
              order: `Failed to cancel the order`,
            });
            return await Utils.returnResult("Failed to cancel the order", {
              ValidationErrors: errors,
            });
          }

          const excludeFields = ["status", "createdAt", "updatedAt"];

          const includes = [];
          const msg = "Get Updated Order";
          const fetchObjParams = {
            model: orderModel,
            fetchRowCond: { orderId: orderId },
            msg,
            excludeFields,
            includes,
          };

          const order = await Utils.findOne(fetchObjParams);
          return order.resultSet
            ? await Utils.returnResult("order", order, null, 1)
            : await Utils.returnResult("order", order, "No order found");
        } catch (error) {
          console.log("error is: ", error);
          await Utils.returnResult("order", false, "No record found");
        }
      }
    }

    if (errors.length > 0) {
      return await Utils.returnResult("Areana/booking existance", {
        ValidationErrors: errors,
      });
    }
  },
};
