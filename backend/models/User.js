const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  role: { type: String, enum: ['CLIENT','FREELANCER','AGENCY_MANAGER','PAYMENT_MANAGER','ADMIN'], default: 'CLIENT' },
  agencyName: { type: String, default: '' },
  agencySize: { type: Number, default: 1 },
  bio: { type: String, default: '' },
  skills: [{ type: String }],
  experience: { type: Number, default: 0 },
  hourlyRate: { type: Number, default: 0 },
  availability: { type: String, enum: ['AVAILABLE','BUSY','UNAVAILABLE'], default: 'AVAILABLE' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  successRate: { type: Number, default: 0 },
  responseRate: { type: Number, default: 0 },
  trustScore: { type: Number, default: 50 },
  profileStrength: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  country: { type: String, default: '' },
  language: { type: String, default: 'en' },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Never return password
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
