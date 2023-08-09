const express = require("express");
const router = express.Router();
const path = require("path");
const Utils = require(path.resolve("src//utils"));
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: "rzp_test_kvq0flV7YLPMFu",
  key_secret: "Au4ih494g0lYoWZuXhGB3nfS",
});

router.post("/arena", async(req, res) => {
    let resultSet = {
      message:"User Signin-up module",
      result:[],
      totalRows:0
  };
  

  await Utils.retrunResponse(res, resultSet);
})

router.post("/arena", async(req, res) => {
    let resultSet = {
      message:"User Signin-up module",
      result:[],
      totalRows:0
  };  

  await Utils.retrunResponse(res, resultSet);
})

router.post("/create-order", async (req, res, next) => {
  try {
    const amount = 1000; // Replace with the actual amount
    const options = {
      amount: amount,
      currency: "INR",
      receipt: "order_receipt",
    };

    const order = await razorpay.orders.create(options);

    let resultSet = {
      message: "create an order",
      result: [{ order_id: order.id, amount: order.amount }],
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
    } = req.body;

    let resultSet = {
      message: "payment success",
      result: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      },
      totalRows: 0,
    };

    await Utils.retrunResponse(res, resultSet);

    /*
        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret); 
        const shasum = crypto.createHmac("sha256", "w2lBtgmeuDUfnJVp43UpcaiT");

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        })
        */
  } catch (error) {
    res.status(500).send(error);
  }
});
module.exports = router;
