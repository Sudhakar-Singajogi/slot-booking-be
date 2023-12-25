const Joi = require("joi");
const path = require("path");
const utils = require(path.resolve("src/utils"));

const getTurfsSchema = Joi.object().keys({
  arena_id: Joi.string().required(),
});

const getTurfsSportsSchema = Joi.object().keys({
  arena_id: Joi.string().required().error(() =>  'Arena Id cannot be empty'),
  turfid:Joi.number().greater(0).error(() =>  'Provide valid turf id').optional(),
});

const turfExistsSchema = Joi.object().keys({
  arena_id: Joi.string().required().error(() =>  'Arena Id cannot be empty'),
  turf_id:Joi.number().greater(0).error(() =>  'Provide valid turf id').optional(),
  bookedAt:Joi.string().required().error(() =>  'Provide valid booking time').optional(),
  bookedDate:Joi.string().required().error(() =>  'Booked Date is requried'),
  bookedTill:Joi.number().required().greater(0).error(() =>  'Provide valid playing hours').optional(),
});

const schemas = {
  getTurfsSchema,
  getTurfsSportsSchema,
  turfExistsSchema
};
module.exports = schemas;
