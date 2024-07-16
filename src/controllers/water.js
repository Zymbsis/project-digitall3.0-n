import createHttpError from 'http-errors';
import {
  getAllWaterIntakes,
  addWaterIntake,
  patchWaterIntake,
  deleteWaterIntake,
  getInfoByDay,
  getInfoByMonth,
} from '../services/water.js';

export const getAllWaterIntakesController = async (req, res, next) => {
  const {
    user: { _id: userId },
  } = req;

  const result = await getAllWaterIntakes(userId);
  res.json({
    status: 200,
    message: result.length
      ? 'Successfully found all water portions.'
      : 'No water portions has been added yet',
    data: result,
  });
};

export const addWaterIntakeController = async (req, res) => {
  const {
    user: { _id: userId, dailyNorma },
    body,
  } = req;

  const result = await addWaterIntake({
    userId,
    ...body,
    dailyNorma,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully added new water portion',
    data: result,
  });
};

export const patchWaterIntakeController = async (req, res, next) => {
  const {
    body,
    params: { id: portionId },
    user: { _id: userId },
  } = req;

  const portion = await patchWaterIntake(portionId, userId, body);

  if (!portion) {
    return next(createHttpError(404, 'Selected water portion not found'));
  }

  res.status(200).send({
    status: 200,
    message: 'Successfully updated selected water portion',
    data: portion,
  });
};

export const deleteWaterIntakeController = async (req, res, next) => {
  const {
    params: { id: portionId },
    user: { _id: userId },
  } = req;

  const data = await deleteWaterIntake(portionId, userId);

  if (!data) {
    return next(createHttpError(404, 'Selected water portion not found'));
  }

  res.status(204).send();
};

export const getInfoByDayController = async (req, res) => {
  const {
    params: { date },
  } = req;

  const data = await getInfoByDay(date);

  res.json({
    status: 200,
    message: data.portions.length
      ? 'Successfully found water portions for selected date'
      : 'No water portions found for selected date',
    data,
  });
};

export const getInfoByMonthController = async (req, res) => {
  const {
    params: { date },
  } = req;

  const data = await getInfoByMonth(date);

  res.json({
    status: 200,
    message: data.days.length
      ? 'Successfully found history for selected month'
      : 'No history found for selected month',
    data,
  });
};
