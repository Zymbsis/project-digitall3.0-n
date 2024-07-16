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

  const data = await getAllWaterIntakes(userId);

  res.json({
    status: 200,
    message: result.length
      ? 'Successfully found all water intakes.'
      : 'No water intakes has been added yet.',
    data,
  });
};

export const addWaterIntakeController = async (req, res) => {
  const {
    user: { _id: userId, dailyNorma },
    body,
  } = req;

  const waterIntake = await addWaterIntake({
    userId,
    ...body,
    dailyNorma,
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully added new water intake.',
    data: waterIntake,
  });
};

export const patchWaterIntakeController = async (req, res, next) => {
  const {
    body,
    params: { id: portionId },
    user: { _id: userId },
  } = req;

  const waterIntake = await patchWaterIntake(portionId, userId, body);

  if (!waterIntake) {
    return next(createHttpError(404, 'Selected water intake not found.'));
  }

  res.json({
    status: 200,
    message: 'Successfully updated selected water intake.',
    data: waterIntake,
  });
};

export const deleteWaterIntakeController = async (req, res, next) => {
  const {
    params: { id: portionId },
    user: { _id: userId },
  } = req;

  const waterIntake = await deleteWaterIntake(portionId, userId);

  if (!waterIntake) {
    return next(createHttpError(404, 'Selected water intake not found.'));
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
      ? 'Successfully found water intakes for selected date.'
      : 'No water intakes found for selected date.',
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
      ? 'Successfully found history for selected month.'
      : 'No history found for selected month.',
    data,
  });
};
