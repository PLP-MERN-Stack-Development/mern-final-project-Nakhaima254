const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');
const { validationResult } = require('express-validator');

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Public
const getMedicines = async (req, res) => {
  try {
    const {
      pharmacy,
      name,
      availability,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    let query = {};

    if (pharmacy) {
      query.pharmacy = pharmacy;
    }

    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }

    if (availability !== undefined) {
      query.availability = availability === 'true';
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const medicines = await Medicine.find(query)
      .populate('pharmacy', 'name location contact verified')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Medicine.countDocuments(query);

    res.status(200).json({
      success: true,
      count: medicines.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: medicines
    });
  } catch (error) {
    console.error('Get medicines error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Public
const getMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id)
      .populate('pharmacy', 'name location contact verified');

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    res.status(200).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    console.error('Get medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create medicine
// @route   POST /api/medicines
// @access  Private (Pharmacy owner)
const createMedicine = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { pharmacy: pharmacyId } = req.body;

    // Check if pharmacy exists and user owns it
    const pharmacy = await Pharmacy.findById(pharmacyId);
    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: 'Pharmacy not found'
      });
    }

    if (pharmacy.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add medicines to this pharmacy'
      });
    }

    const medicine = await Medicine.create(req.body);

    res.status(201).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    console.error('Create medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Private (Pharmacy owner)
const updateMedicine = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    // Check if user owns the pharmacy that owns this medicine
    const pharmacy = await Pharmacy.findById(medicine.pharmacy);
    if (pharmacy.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this medicine'
      });
    }

    medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    console.error('Update medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private (Pharmacy owner)
const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    // Check if user owns the pharmacy that owns this medicine
    const pharmacy = await Pharmacy.findById(medicine.pharmacy);
    if (pharmacy.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this medicine'
      });
    }

    await Medicine.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Medicine deleted successfully'
    });
  } catch (error) {
    console.error('Delete medicine error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get medicines by pharmacy
// @route   GET /api/medicines/pharmacy/:pharmacyId
// @access  Public
const getMedicinesByPharmacy = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const medicines = await Medicine.find({ pharmacy: req.params.pharmacyId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Medicine.countDocuments({ pharmacy: req.params.pharmacyId });

    res.status(200).json({
      success: true,
      count: medicines.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: medicines
    });
  } catch (error) {
    console.error('Get medicines by pharmacy error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getMedicines,
  getMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getMedicinesByPharmacy
};