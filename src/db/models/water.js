import { model, Schema } from 'mongoose';
const doseSchema = new Schema(
  {
    time: { type: String, required: true },
    volume: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
export const waterCollection = model('water', doseSchema);
