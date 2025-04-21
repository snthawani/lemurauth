import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: String,
  phone: String,
  token: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
