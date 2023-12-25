const Joi = require("joi");
const path = require("path");
const utils = require(path.resolve("src/utils"));

const getCaptainDetailsSchema = Joi.object().keys({
  captain_contact: Joi.string().required().length(10).error((errors) => {

    const validationError = errors[0];
      if (validationError.type === 'any.empty') {
        return 'Mobile number is required';
      }
      return 'Provide valid 10-digit mobile number';
  }),
}).options({ abortEarly: true })

const schemas = {
  getCaptainDetailsSchema,
};
module.exports = schemas;
