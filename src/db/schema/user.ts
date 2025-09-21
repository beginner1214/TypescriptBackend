import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

export const UserModel = mongoose.model("User", userSchema);

export const getuser = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  });
export const getUserByid = (id: string) => UserModel.findById({ id });

export const createuser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const updateuser = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values, { new: true }).then((user) =>
    user ? user.toObject() : null
  );
export const deleteuser = (id: string) =>
  UserModel.findByIdAndDelete(id)
  .then((user) => (user ? user.toObject() : null));
