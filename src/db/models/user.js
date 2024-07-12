import { model, Schema } from 'mongoose';

const usersSchema = new Schema(
  {
    email: { type: String, email: true, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, default: 'User' },
    gender: { type: String, enum: ['man', 'woman'], default: 'woman' },
    avatar: { type: String, default: 'Here should be a placeholder image' },
    dailyNorma: { type: Number, min: 0, max: 10, default: 1.8 },
    weight: { type: Number, min: 0, default: 0 },
    activeHours: { type: Number, min: 0, max: 12, default: 0 },
  },
  { timestamps: true, versionKey: false },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('users', usersSchema);
