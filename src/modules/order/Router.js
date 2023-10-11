const express = require("express");
const router = express.Router();
const path = require("path");
const Utils = require(path.resolve("src/utils"));
const Razorpay = require("razorpay");
const crypto = require("crypto");
let bookingModel = require(path.resolve("src/modules/booking/Booking"));
let orderModel = require(path.resolve("src/modules/order/Order"));

const razorpay = new Razorpay({
  key_id: "rzp_test_kvq0flV7YLPMFu",
  key_secret: "Au4ih494g0lYoWZuXhGB3nfS",
});

router.post("/create-order", async (req, res, next) => {
  const reqBody = req.body;
  const bookingcost = reqBody.booking_cost;
  const advance_payment = reqBody.advance_payment;
  const balance_amount = reqBody.balance_amount;

  let coupon_amount = 0;
  let coupon_code = "NA";

  if (
    reqBody.hasOwnProperty("coupon_amount") &&
    reqBody.hasOwnProperty("coupon_code")
  ) {
    coupon_amount = reqBody.coupon_amount;
    coupon_code = reqBody.coupon_code;
    delete reqBody.advance_payment;
    delete reqBody.balance_amount;
  }

  delete reqBody.booking_cost;
  delete reqBody.advance_payment;
  delete reqBody.balance_amount;

  try {
    const createdBooking = await bookingModel.create(reqBody);

    const bookingid = createdBooking.bookingId;

    console.log("bookingid:", bookingid);

    const amount = advance_payment; // Replace with the actual amount
    const options = {
      amount: advance_payment,
      currency: "INR",
      receipt: "order_receipt",
    };

    const order = await razorpay.orders.create(options);

    //now lets create the order
    const orderObj = {
      orderCreationId: order.id,
      bookingid: bookingid,
      turf_cost: bookingcost,
      advanced_paid: advance_payment,
      balance_amount: balance_amount,
      refund_amount: 0.0,
      coupon_code: coupon_code,
      coupon_amount: coupon_amount,
      status: "0",
    };

    const createdOrder = await orderModel.create(orderObj);
    console.log("createdOrder: ", createdOrder);

    let resultSet = {
      message: "create an order",
      result: [
        {
          order_id: order.id,
          amount: order.amount,
          bookingid: bookingid,
          orderId: createdOrder.orderId,
        },
      ],
      totalRows: 1,
    };
    await Utils.retrunResponse(res, resultSet);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating order");
  }
});

router.post("/success", async (req, res) => {
  try {
    // getting the details back from our font-end
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      bookingid,
      orderId,
    } = req.body;

    //update the status of the bookking
    const bookingUpdate = await Utils.updateData(
      bookingModel,
      { status: "1" },
      {
        where: { bookingId: bookingid },
      }
    );

    console.log("bookingUpdate: ", bookingUpdate);
    if (!bookingUpdate.error) {
      const orderUpdate = await Utils.updateData(
        orderModel,
        { status: "1" },
        {
          where: { orderId: orderId },
        }
      );

      if (orderUpdate.error) {
      }
    } else {
      //handle the error
    }

    let resultSet = {
      message: "payment success",
      result: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      },
      totalRows: 0,
    };
    await Utils.retrunResponse(res, resultSet);
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
