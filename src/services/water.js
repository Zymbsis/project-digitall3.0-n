import { Water } from '../db/models/water.js';

export const getAllPortions = async (userId) => await Water.find({ userId });

export const addPortion = async (payload) => await Water.create(payload);

export const patchPortion = async (_id, userId, payload) =>
  await Water.findOneAndUpdate({ _id, userId }, payload, { new: true });

export const deletePortion = async (_id, userId) =>
  await Water.findOneAndDelete({ _id, userId });

export const getPortionsByDay = async (date) => {
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

  return result[0];
};

export const getPortionsByMonth = async (date) => {
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
        _id: '$day',
        date: '$_id',
        portions: 1,
        completionRate: 1,
      },
    },
  ]);
  return result;
};
