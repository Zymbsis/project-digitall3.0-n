import createHttpError from 'http-errors';
import {
  getAllPortions,
  addPortion,
  patchPortion,
  deletePortion,
  getPortionsByDay,
  getPortionsByMonth,
} from '../services/water.js';

export const getAllPortionsController = async (req, res, next) => {
  const {
    user: { _id: userId },
  } = req;

  const result = await getAllPortions(userId);
  res.json({
    status: 200,
    message: result.length
      ? 'Successfully found all water portions.'
      : 'No water portions has been added yet',
    data: result,
  });
};

export const addPortionController = async (req, res) => {
  const {
    user: { _id: userId, dailyNorma },
    body,
  } = req;

  const result = await addPortion({
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

export const patchPortionController = async (req, res, next) => {
  const {
    body,
    params: { id: portionId },
    user: { _id: userId },
  } = req;

  const portion = await patchPortion(portionId, userId, body);

  if (!portion) {
    return next(createHttpError(404, 'Selected water portion not found'));
  }

  res.json({
    status: 200,
    message: 'Successfully updated selected water portion',
    data: portion,
  });
};

export const deletePortionController = async (req, res, next) => {
  const {
    params: { id: portionId },
    user: { _id: userId },
  } = req;

  const portion = await deletePortion(portionId, userId);

  if (!portion) {
    return next(createHttpError(404, 'Selected water portion not found'));
  }

  res.status(204).send();
};

export const getPortionsByDayController = async (req, res) => {
  const {
    params: { date },
  } = req;

  const data = await getPortionsByDay(date);

  res.json({
    status: 200,
    message: data.portions.length
      ? 'Successfully found water portions for selected date'
      : 'No water portions found for selected date',
    data,
  });
};

export const getPortionsByMonthController = async (req, res) => {
  const {
    params: { date },
  } = req;

  const data = await getPortionsByMonth(date);

  res.json({
    status: 200,
    message: data.days.length
      ? 'Successfully found history for selected month'
      : 'No history found for selected month',
    data,
  });
};
