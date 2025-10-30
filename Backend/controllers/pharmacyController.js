const Pharmacy = require('../models/Pharmacy');
const { validationResult } = require('express-validator');

// @desc    Get all pharmacies
// @route   GET /api/pharmacies
// @access  Public
const getPharmacies = async (req, res) => {
  try {
    const { verified, location, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};

    if (verified !== undefined) {
      query.verified = verified === 'true';
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const pharmacies = await Pharmacy.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Pharmacy.countDocuments(query);

    res.status(200).json({
      success: true,
      count: pharmacies.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: pharmacies
    });
  } catch (error) {
    console.error('Get pharmacies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single pharmacy
// @route   GET /api/pharmacies/:id
// @access  Public
const getPharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id)
      .populate('user', 'name email');

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pharmacy
    });
  } catch (error) {
    console.error('Get pharmacy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create pharmacy
// @route   POST /api/pharmacies
// @access  Private (Pharmacy role)
const createPharmacy = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if user already has a pharmacy
    const existingPharmacy = await Pharmacy.findOne({ user: req.user._id });
    if (existingPharmacy) {
      return res.status(400).json({
        success: false,
        message: 'User already has a pharmacy'
      });
    }

    const pharmacy = await Pharmacy.create({
      ...req.body,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      data: pharmacy
    });
  } catch (error) {
    console.error('Create pharmacy error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'License number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update pharmacy
// @route   PUT /api/pharmacies/:id
// @access  Private (Pharmacy owner or Admin)
const updatePharmacy = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    // Make sure user owns pharmacy or is admin
    if (pharmacy.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this pharmacy'
      });
    }

    pharmacy = await Pharmacy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: pharmacy
    });
  } catch (error) {
    console.error('Update pharmacy error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'License number already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete pharmacy
// @route   DELETE /api/pharmacies/:id
// @access  Private (Pharmacy owner or Admin)
const deletePharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    // Make sure user owns pharmacy or is admin
    if (pharmacy.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this pharmacy'
      });
    }

    await Pharmacy.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Pharmacy deleted successfully'
    });
  } catch (error) {
    console.error('Delete pharmacy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's pharmacy
// @route   GET /api/pharmacies/mypharmacy
// @access  Private (Pharmacy role)
const getMyPharmacy = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ user: req.user._id });

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'No pharmacy found for this user'
      });
    }

    res.status(200).json({
      success: true,
      data: pharmacy
    });
  } catch (error) {
    console.error('Get my pharmacy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getPharmacies,
  getPharmacy,
  createPharmacy,
  updatePharmacy,
  deletePharmacy,
  getMyPharmacy
};