const Joi = require("joi");
const path = require("path");
const utils = require(path.resolve("src/utils"));

const getBookedSlotsSchema = Joi.object().keys({
  arena_id: Joi.string().required().error(() =>  'Arena Id cannot be empty'),
  bookedDate: Joi.string().required().error(() =>  'Booked Date cannot be empty'),
  turf_id:Joi.number().greater(0).error(() =>  'Provide valid turf id').optional(),
});

const schemas = {
  getBookedSlotsSchema,
};
module.exports = schemas;
