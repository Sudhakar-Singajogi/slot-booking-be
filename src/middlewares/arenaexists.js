const path = require("path");
const utils = require(path.resolve("src/utils"));
const APPCONS = require(path.resolve("appconstants"));
let venueModel = require(path.resolve("src/modules/venue/Venue"));

const checkArenaExists = () => {
  return async (req, res, next) => {
    const condition = { arena_id: req.body.arena_id };
    const isAreanaExists = await utils.checkRowExists(
      condition,
      venueModel,
      "check whether areana exists"
    );

    if (isAreanaExists === 0) {
      const errMsg = {
        result: "OK",
        resultCode: 403,
        message: APPCONS.INVALIDARENA,
        ValidationErrors: APPCONS.ACCESSDENIED,
        data: [],
        resultTotal: 0,
        hasMore: false,
      };

      return res.status(403).json(errMsg);
    }
    next();
  };
};

module.exports = { checkArenaExists };
