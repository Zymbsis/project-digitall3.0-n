import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export const validateId =
  (someId = 'id') =>
  (req, res, next) => {
    const id = req.params[someId];

    if (!id) throw Error('validateMongoId: id is missing');

    if (!isValidObjectId(id)) {
      return next(
        createHttpError(
          400,
          'Wrong id. Contact id has to be of 24 alphanumerical symbols length',
        ),
      );
    }
    return next();
  };
