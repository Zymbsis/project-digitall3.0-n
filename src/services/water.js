import { Water } from '../db/models/water.js';

export const getAllWaterIntakes = async (userId) =>
  await Water.find({ userId });

export const addWaterIntake = async (payload) => await Water.create(payload);

export const patchWaterIntake = async (_id, userId, payload) =>
  await Water.findOneAndUpdate({ _id, userId }, payload, { new: true });

export const deleteWaterIntake = async (_id, userId) =>
  await Water.findOneAndDelete({ _id, userId });

export const getInfoByDay = async (date) => {
  const result = await Water.aggregate([
    { $match: { date } },
    { $sort: { time: 1 } },
    {
      $group: {
        _id: null,
        portions: {
          $push: {
            _id: '$_id',
            userId: '$userId',
            time: '$time',
            date: '$date',
            volume: '$volume',
            dailyNorma: '$dailyNorma',
            createdAt: '$createdAt',
            updatedAt: '$updatedAt',
          },
        },
        totalVolume: { $sum: '$volume' },
        lastDocument: { $last: '$$ROOT' },
      },
    },
    {
      $addFields: {
        completionRate: {
          $divide: ['$totalVolume', '$lastDocument.dailyNorma'],
        },
        date,
      },
    },
    { $project: { _id: 0, date: 1, portions: 1, completionRate: 1 } },
  ]);

  if (result.length) {
    const [{ date, portions, completionRate }] = result;
    return { date, portions, completionRate };
  } else {
    return { date, portions: [], completionRate: 0 };
  }
};

export const getInfoByMonth = async (date) => {
  const monthQuery = new RegExp(`^${date}`);

  const result = await Water.aggregate([
    { $match: { date: { $regex: monthQuery } } },
    { $sort: { date: 1 } },
    {
      $group: {
        _id: '$date',
        portions: {
          $push: {
            _id: '$_id',
            userId: '$userId',
            day: '$day',
            time: '$time',
            date: '$date',
            volume: '$volume',
            dailyNorma: '$dailyNorma',
            createdAt: '$createdAt',
            updatedAt: '$updatedAt',
          },
        },
        totalVolume: { $sum: '$volume' },
        lastDocument: { $last: '$$ROOT' },
      },
    },
    {
      $addFields: {
        completionRate: {
          $divide: ['$totalVolume', '$lastDocument.dailyNorma'],
        },
        day: { $substr: ['$lastDocument.date', 8, 2] },
      },
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        _id: 0,
        day: '$day',
        portions: 1,
        completionRate: 1,
      },
    },
  ]);

  if (!result.length) {
    return { date, days: [] };
  }

  return { date, days: result };
};
