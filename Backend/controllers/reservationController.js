const Reservation = require('../models/Reservation');
const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');
const { validationResult } = require('express-validator');

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private
const getReservations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build query based on user role
    let query = {};

    if (req.user.role === 'consumer') {
      query.user = req.user._id;
    } else if (req.user.role === 'pharmacy') {
      // Get pharmacy owned by user
      const pharmacy = await Pharmacy.findOne({ user: req.user._id });
      if (pharmacy) {
        query.pharmacy = pharmacy._id;
      } else {
        return res.status(404).json({
          success: false,
          message: 'No pharmacy found for this user'
        });
      }
    }
    // Admin can see all reservations

    if (status) {
      query.status = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reservations = await Reservation.find(query)
      .populate('user', 'name email')
      .populate('medicine', 'name strength price')
      .populate('pharmacy', 'name location contact')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Reservation.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reservations.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: reservations
    });
  } catch (error) {
    console.error('Get reservations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private
const getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('user', 'name email')
      .populate('medicine', 'name strength price')
      .populate('pharmacy', 'name location contact');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Check if user can view this reservation
    if (req.user.role === 'consumer' && reservation.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this reservation'
      });
    }

    if (req.user.role === 'pharmacy') {
      const pharmacy = await Pharmacy.findOne({ user: req.user._id });
      if (!pharmacy || reservation.pharmacy._id.toString() !== pharmacy._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this reservation'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Get reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create reservation
// @route   POST /api/reservations
// @access  Private (Consumer)
const createReservation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { medicine: medicineId } = req.body;

    // Check if medicine exists and is available
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }

    if (!medicine.availability) {
      return res.status(400).json({
        success: false,
        message: 'Medicine is not available'
      });
    }

    // Check if user already has a pending reservation for this medicine
    const existingReservation = await Reservation.findOne({
      user: req.user._id,
      medicine: medicineId,
      status: 'pending'
    });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending reservation for this medicine'
      });
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      medicine: medicineId,
      pharmacy: medicine.pharmacy
    });

    await reservation.populate('user', 'name email');
    await reservation.populate('medicine', 'name strength price');
    await reservation.populate('pharmacy', 'name location contact');

    res.status(201).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update reservation status
// @route   PUT /api/reservations/:id
// @access  Private (Consumer or Pharmacy owner)
const updateReservationStatus = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status } = req.body;

    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Check permissions
    if (req.user.role === 'consumer') {
      // Consumers can only update their own reservations
      if (reservation.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this reservation'
        });
      }
      // Consumers can only cancel their reservations
      if (status !== 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Consumers can only cancel reservations'
        });
      }
    } else if (req.user.role === 'pharmacy') {
      // Pharmacy owners can only update reservations for their pharmacy
      const pharmacy = await Pharmacy.findOne({ user: req.user._id });
      if (!pharmacy || reservation.pharmacy.toString() !== pharmacy._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this reservation'
        });
      }
      // Pharmacy owners can only confirm or cancel reservations
      if (!['confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status for pharmacy update'
        });
      }
    }

    reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('medicine', 'name strength price')
      .populate('pharmacy', 'name location contact');

    res.status(200).json({
      success: true,
      data: reservation
    });
  } catch (error) {
    console.error('Update reservation status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete reservation
// @route   DELETE /api/reservations/:id
// @access  Private (Consumer or Pharmacy owner)
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    // Check permissions
    if (req.user.role === 'consumer') {
      if (reservation.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this reservation'
        });
      }
    } else if (req.user.role === 'pharmacy') {
      const pharmacy = await Pharmacy.findOne({ user: req.user._id });
      if (!pharmacy || reservation.pharmacy.toString() !== pharmacy._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this reservation'
        });
      }
    }

    await Reservation.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Reservation deleted successfully'
    });
  } catch (error) {
    console.error('Delete reservation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getReservations,
  getReservation,
  createReservation,
  updateReservationStatus,
  deleteReservation
};