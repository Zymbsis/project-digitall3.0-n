import { Schema, model } from 'mongoose';

const waterSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    time: { type: String, required: true },
    date: { type: String, required: true },
    volume: { type: Number, required: true },
    dailyNorma: { type: Number, default: 1800 },
  },
  { timestamps: true, versionKey: false },
);

export const Water = model('water', waterSchema);
