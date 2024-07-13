import joi from 'joi';

export const addPortionSchema = joi.object({
  time: joi.string().min(5).max(13).required(),
  date: joi.string().min(7).max(10).required(),
  volume: joi.number().min(50).max(1000).required(),
});

export const patchPortionSchema = joi.object({
  time: joi.string().min(5).max(13),
  volume: joi.number().min(50).max(1000),
});
