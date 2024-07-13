import moment from 'moment';
import createHttpError from 'http-errors';

export const validateDate =
  (someDate = 'date') =>
  (req, res, next) => {
    const date = req.params[`${someDate}`];
    const [period] = req.path.slice(1).split('/');

    const isDay = date.length === 10 && period === 'day';
    const isMonth = date.length === 7 && period === 'month';

    if (!isDay && !isMonth) {
      return next(
        createHttpError(
          400,
          'Wrong date format. Should be YYYY-MM-DD or YYYY-MM',
        ),
      );
    }

    if (isDay && !moment(date, 'YYYY-MM-DD', true).isValid()) {
      return next(
        createHttpError(400, 'Wrong day format. Should be YYYY-MM-DD'),
      );
    }

    if (isMonth && !moment(date, 'YYYY-MM', true).isValid()) {
      return next(
        createHttpError(400, 'Wrong month format. Should be YYYY-MM'),
      );
    }

    return next();
  };
