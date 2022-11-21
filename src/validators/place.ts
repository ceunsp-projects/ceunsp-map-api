import joi from 'joi';

export const PlaceValidator = joi.object({
  name: joi.string().required(),
  location: joi.object({
    latitude: joi.number(),
    longitude: joi.number()
  }),
  mainPicture: joi.string().required(),
  pictures: joi.array().items(joi.string()).min(1).required(),
  items: joi.array().items(joi.string()).optional(),
});
