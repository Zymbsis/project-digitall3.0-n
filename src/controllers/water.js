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
    message: 'Successfully added water portion',
    data: result,
  });
};

export const patchPortionController = async (req, res) => {
  const {
    body,
    params: { id: portionId },
    user: { _id: userId },
  } = req;

  const result = await patchPortion(portionId, userId, body);

  res.json(result);
};

export const deletePortionController = async (req, res) => {
  const {
    params: { id: portionId },
    user: { _id: userId },
  } = req;

  await deletePortion(portionId, userId);

  res.status(204).send();
};

export const getPortionsByDayController = async (req, res) => {
  const {
    params: { date },
  } = req;

  const result = await getPortionsByDay(date);

  res.json(result);
};

export const getPortionsByMonthController = async (req, res) => {
  const {
    params: { date },
  } = req;

  const result = await getPortionsByMonth(date);

  res.json(result);
};
