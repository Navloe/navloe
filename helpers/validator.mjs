import yup from "yup";

/**
 * @param {import('yup').ObjectSchema} schema
 * @type {Object}
 * @property {array} errors The X-coordinate.
 */
export default async (schema, body)=> {
  try {
    await schema.validate(body, {
      abortEarly: false,
    });

    return {
      errors: null,
    };
  } catch (error) {
    return error;
  }
}