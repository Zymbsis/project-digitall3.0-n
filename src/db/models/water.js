import { Schema, model } from 'mongoose';

const waterSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true },
    time: { type: String, required: true },
    date: { type: String, required: true },
    volume: { type: Number, required: true },
    dailyNorma: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const Water = model('water', waterSchema);
