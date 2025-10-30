const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  strength: {
    type: String,
    required: [true, 'Strength is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  availability: {
    type: Boolean,
    default: true
  },
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
medicineSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for better query performance
medicineSchema.index({ pharmacy: 1 });
medicineSchema.index({ name: 1 });
medicineSchema.index({ availability: 1 });
medicineSchema.index({ name: 1, availability: 1 });

module.exports = mongoose.model('Medicine', medicineSchema);