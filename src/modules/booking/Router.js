const express = require("express");
const router = express.Router();
const path = require("path");
const Utils = require(path.resolve("src//utils")); 
const bookingServ = require(path.resolve("src/modules/booking/Services"));


router.post("/get-booked-slots",async (req, res, next) => {
    //   let resultSet = {
    //     message: "User Signin-up module",
    //     result: [],
    //     totalRows: 0,
    //   };
    
    const reqObj = req.body;
    var resultSet = await bookingServ.fetchSlotsBooked(reqObj);
    console.log('resultSet is:', resultSet);  
    
      await Utils.retrunResponse(res, resultSet);
    }); 



module.exports = router;
