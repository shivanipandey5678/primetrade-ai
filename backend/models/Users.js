import mongoose, { Types } from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favorites: [
    {type : mongoose.Schema.Types.ObjectId , ref : 'Product'}
  ]
},{
    timestamps:true
});

const User = mongoose.model('User',userSchema);
export { User};