const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pharmacy name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  license: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    trim: true
  },
  contact: {
    type: String,
    required: [true, 'Contact information is required'],
    trim: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
pharmacySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
pharmacySchema.index({ location: 1 });
pharmacySchema.index({ verified: 1 });
pharmacySchema.index({ user: 1 });

module.exports = mongoose.model('Pharmacy', pharmacySchema);