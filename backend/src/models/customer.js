import mongoose from "mongoose";


const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, index: true },
  lastName: { type: String, trim: true, index: true },
  email: { type: String, trim: true, index: true },
  phone: { type: String, trim: true, index: true },
  dob: Date,
  gender: { type: String, enum: ['male','female','other'], default: 'other' },
  address: {type:String, trim: true},
  tags: [String],
  status: { type: String, enum: ['lead','active'], default: 'lead', index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// optional simple text index for searching multiple fields
customerSchema.index({ firstName: 'text', lastName: 'text', email: 'text', phone: 'text' });

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;

